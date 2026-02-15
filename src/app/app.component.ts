import { Component, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  title = 'zakattounsia';
  currentLang = 'tn';

  constructor(
    public router: Router,
    public translate: TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Configuration : Français, Arabe, Tunisien (Défaut)
    translate.addLangs(['tn', 'ar', 'fr']);
    translate.setDefaultLang('tn');
    
    // Initialisation
    this.switchLanguage('tn');
  }

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    
    // GESTION DIRECTION (RTL vs LTR)
    const htmlTag = this.document.getElementsByTagName('html')[0];
    if (lang === 'ar' || lang === 'tn') {
      this.renderer.setAttribute(htmlTag, 'dir', 'rtl');
      this.renderer.setAttribute(htmlTag, 'lang', 'ar');
      // Pour Bootstrap en RTL, parfois utile d'ajouter une classe
      this.renderer.addClass(this.document.body, 'rtl');
    } else {
      this.renderer.setAttribute(htmlTag, 'dir', 'ltr');
      this.renderer.setAttribute(htmlTag, 'lang', 'fr');
      this.renderer.removeClass(this.document.body, 'rtl');
    }
  }
}
