import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface HeirResult {
  name: string;
  shareFraction: string;
  sharePercent: number;
  amount: number;
  note: string;
}

@Component({
  selector: 'app-inheritance-calculator',
  templateUrl: './inheritance-calculator.component.html',
  styleUrls: ['./inheritance-calculator.component.scss'],
  standalone: false
})
export class InheritanceCalculatorComponent implements OnInit {
  heritageForm: FormGroup;
  results: HeirResult[] = [];

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire avec des valeurs par défaut
    this.heritageForm = this.fb.group({
      netEstate: [10000, [Validators.required, Validators.min(0)]], // Montant
      gender: ['male'], // Défunt
      husband: [false], 
      wife: [true],
      father: [true],
      mother: [true],
      sons: [0],
      daughters: [0],
      siblings: [false] // Frères/Soeurs
    });
  }

  ngOnInit(): void {
    console.log('Inheritance Calculator Initialized');
    
    // 1. Calculer immédiatement au chargement
    this.calculate();

    // 2. Écouter TOUS les changements du formulaire pour rendre la page DYNAMIQUE
    this.heritageForm.valueChanges.subscribe(val => {
      console.log('Changement détecté:', val);
      this.calculate();
    });
  }

  // Helper pour savoir si le défunt est un homme
  get isDeceasedMale(): boolean {
    return this.heritageForm.get('gender')?.value === 'male';
  }

  calculate(): void {
    const v = this.heritageForm.value;
    const estate = v.netEstate || 0;
    
    // Réinitialiser les résultats
    let heirs: any[] = [];
    
    const nbSons = v.sons || 0;
    const nbDaughters = v.daughters || 0;
    const hasChildren = nbSons > 0 || nbDaughters > 0;
    const hasMaleChildren = nbSons > 0;
    const hasSiblings = v.siblings; 

    // --- A. PARTS FIXES (FARD) ---

    // 1. Conjoint
    if (this.isDeceasedMale && v.wife) {
      // Épouse : 1/8 si enfants, 1/4 sinon
      const share = hasChildren ? 0.125 : 0.25;
      heirs.push({ name: 'Épouse', share: share, note: hasChildren ? '1/8 (Enfants présents)' : '1/4 (Pas d\'enfants)' });
    } else if (!this.isDeceasedMale && v.husband) {
      // Époux : 1/4 si enfants, 1/2 sinon
      const share = hasChildren ? 0.25 : 0.5;
      heirs.push({ name: 'Époux', share: share, note: hasChildren ? '1/4 (Enfants présents)' : '1/2 (Pas d\'enfants)' });
    }

    // 2. Père
    if (v.father) {
      // Si enfants: 1/6 fixe. 
      // Si pas d'enfants: il est Asaba (prend le reste), on met 0 ici, on traitera dans le résidu.
      if (hasChildren) {
        heirs.push({ name: 'Père', share: 1/6, note: '1/6 (Enfants présents)', isFather: true });
      } else {
        heirs.push({ name: 'Père', share: 0, note: 'Reste (Asaba)', isAsaba: true, isFather: true });
      }
    }

    // 3. Mère
    if (v.mother) {
      // 1/6 si Enfants OU (Frères/Soeurs). Sinon 1/3.
      if (hasChildren || hasSiblings) {
        heirs.push({ name: 'Mère', share: 1/6, note: '1/6 (Enfants ou Fratrie présents)' });
      } else {
        heirs.push({ name: 'Mère', share: 1/3, note: '1/3 (Ni enfants ni fratrie)' });
      }
    }

    // 4. Filles (Uniquement si PAS de fils, sinon elles sont Asaba avec eux)
    if (nbDaughters > 0 && !hasMaleChildren) {
      if (nbDaughters === 1) {
        heirs.push({ name: 'Fille Unique', share: 0.5, note: '1/2 (Seule, sans frère)' });
      } else {
        heirs.push({ name: `Filles (${nbDaughters})`, share: 2/3, note: '2/3 (Pluralité, sans frère)' });
      }
    }

    // --- B. GESTION DU TOTAL FARD & AWL ---
    let totalFixedShare = 0;
    heirs.forEach(h => { if(!h.isAsaba) totalFixedShare += h.share; });

    // Si le total dépasse 1 => AWL (Réduction proportionnelle)
    let correctionFactor = 1;
    if (totalFixedShare > 1) {
      correctionFactor = 1 / totalFixedShare;
    }

    // Appliquer le facteur de correction aux parts fixes
    heirs.forEach(h => {
      if (!h.isAsaba) {
        h.finalShare = h.share * correctionFactor;
      } else {
        h.finalShare = 0;
      }
    });

    // --- C. RÉSIDU (ASABA) ---
    // Calculer ce qu'il reste après les parts fixes (corrigées si Awl)
    let remainder = 1 - (totalFixedShare * correctionFactor);
    if (remainder < 0) remainder = 0;

    if (remainder > 0) {
      // Qui prend le reste ?
      
      // Cas 1: Fils (+ Filles)
      if (hasMaleChildren) {
        // Règle: 2 parts pour le garçon, 1 pour la fille
        const totalParts = (nbSons * 2) + nbDaughters;
        const partValue = remainder / totalParts;

        heirs.push({ 
          name: `Fils (${nbSons})`, 
          finalShare: partValue * 2 * nbSons, 
          note: 'Asaba (2 parts/fils)' 
        });

        if (nbDaughters > 0) {
          heirs.push({ 
            name: `Filles (${nbDaughters})`, 
            finalShare: partValue * nbDaughters, 
            note: 'Avec les fils (1 part/fille)' 
          });
        }
        remainder = 0;
      }
      // Cas 2: Père (s'il n'avait que sa part fixe ou rien)
      else if (v.father) {
        // Chercher l'objet père existant
        const father = heirs.find(h => h.isFather);
        if (father) {
          father.finalShare += remainder;
          father.note += ' + Reste';
        }
        remainder = 0;
      }
      // Cas 3: Autres (non gérés en détail ici, affichés comme Reste)
    }

    // --- D. FORMATAGE FINAL ---
    this.results = heirs.map(h => ({
      name: h.name,
      shareFraction: (h.finalShare * 100).toFixed(2) + '%',
      sharePercent: h.finalShare * 100,
      amount: Math.round(h.finalShare * estate),
      note: h.note
    }));

    // Ajouter le reste non distribué s'il y en a (Trésor Public / Bait Al Mal / Héritiers éloignés)
    if (remainder > 0.001) {
      this.results.push({
        name: 'Reste (Agnats éloignés)',
        shareFraction: (remainder * 100).toFixed(2) + '%',
        sharePercent: remainder * 100,
        amount: Math.round(remainder * estate),
        note: 'Frères, Oncles, ou Trésor'
      });
    }
  }
}
