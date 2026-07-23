import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Vérifie si l'URL est relative (ex: "/books" ou "books")
  const isRelativeUrl = !req.url.startsWith('http://') && !req.url.startsWith('https://');

  if (isRelativeUrl) {
    // 2. Nettoie les slashs pour éviter les erreurs du type "v1//books"
    const baseUrl = environment.apiUrl.replace(/\/+$/, ''); // Supprime le slash final de l'API s'il existe
    const endpoint = req.url.startsWith('/') ? req.url : `/${req.url}`; // Garantit un slash au début

    // 3. Les objets HttpRequest sont immuables dans Angular, on doit donc en CLONER une copie modifiée
    const apiReq = req.clone({
      url: `${baseUrl}${endpoint}`
    });

    // 4. On transmet la nouvelle requête clonée au suivant
    return next(apiReq);
  }

  // Si c'est une URL externe (ex: "https://api.github.com/users"), on laisse passer sans modifier
  return next(req);
};
