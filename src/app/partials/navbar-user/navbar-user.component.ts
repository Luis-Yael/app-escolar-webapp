import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  public expandedMenu: string | null = null;
  public userInitial: string = '';
  public isMobileView: boolean = window.innerWidth <= 992;
  public showUserMenu: boolean = false;
  public mobileOpen: boolean = false;
  public userRole: string = '';

  // Estas variables se utilizarán por si se habilita el tema oscuro
  paletteMode: 'light' | 'dark' = 'light';
  colorPalettes = {
    light: {
      '--background-main': '#f4f7fb',
      '--sidebar-bg': '#23395d',
      '--navbar-bg': '#fff',
      '--text-main': '#222',
      '--table-bg': '#fff',
      '--table-header-bg': '#cfe2ff',
    },
    dark: {
      '--background-main': '#181a1b',
      '--sidebar-bg': '#1a2636',
      '--navbar-bg': '#222',
      '--text-main': '#e4ecfa',
      '--table-bg': '#222',
      '--table-header-bg': '#30507a',
    }
  };

  togglePalette() {
    this.paletteMode = this.paletteMode === 'light' ? 'dark' : 'light';
    const palette = this.colorPalettes[this.paletteMode];
    Object.keys(palette).forEach(key => {
      document.documentElement.style.setProperty(key, palette[key]);
    });
  }

  constructor(private router: Router, private facadeService: FacadeService) {
    // Obtenemos el rol del usuario y la inicial del nombre
    const name = this.facadeService.getUserCompleteName();
    if (name && name.length > 0) {
      this.userInitial = name.trim()[0].toUpperCase();
    } else {
      this.userInitial = '?';
    }
    this.userRole = this.facadeService.getUserGroup();
    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth <= 992;
      if (!this.isMobileView) {
        this.mobileOpen = false;
      }
    });
    // Siempre inicia con la paleta blanca
    this.paletteMode = 'light';
    const palette = this.colorPalettes['light'];
    Object.keys(palette).forEach(key => {
      document.documentElement.style.setProperty(key, palette[key]);
    });
  }

  ngOnInit(): void {

  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth <= 992;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar() {
    this.mobileOpen = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  editUser() {
    const userId = this.facadeService.getUserId();
    const userRole = this.facadeService.getUserGroup();
    this.router.navigate([`/registro-usuarios/${userRole}/${userId}`]);
    this.showUserMenu = false;
  }

  toggleMenu(menu: string) {
    this.expandedMenu = this.expandedMenu === menu ? null : menu;
  }

  closeMenu() {
    this.expandedMenu = null;
  }

  logout() {
    // TODO: Después modificar el servicio de logout para que limpie la sesión en el backend
    this.facadeService.logout().subscribe(
      () => {
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      () => {
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    );
  }

  // Role helpers
  isAdmin(): boolean {
    return this.userRole === 'administrador';
  }
  isTeacher(): boolean {
    return this.userRole === 'maestro';
  }
  isStudent(): boolean {
    return this.userRole === 'alumno';
  }
  canSeeAdminItems(): boolean {
    return this.isAdmin();
  }
  canSeeTeacherItems(): boolean {
    return this.isAdmin() || this.isTeacher();
  }
  canSeeStudentItems(): boolean {
    return this.isAdmin() || this.isTeacher() || this.isStudent();
  }
  canSeeHomeItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }
  canSeeRegisterItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

}
