import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

// import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
 private token: string=''
 load =0
 private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private cookieService : CookieService) {
    if(cookieService.get('token')){
      this.isAuthenticated=true
    }
    else{
      this.isAuthenticated=false
    }
  }
 //use token and store
  getToken() {
    this.token=localStorage.getItem('token')
   return this.token;
  }

  getIsAuth(){
   console.log('is auth?', this.isAuthenticated)
    
    return this.isAuthenticated
  }


  createUser(email: string, password: string) {
    const authData= {email: email, password: password};
    //post send req to backend (api/user/signup accept request)
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  reload(){
    location.reload()
  }

  login(email: string, password: string) {
    const authData = {email: email, password: password};
    this.http
      .post<{token: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        console.log(token)
        // this.token = token;
        if (token!==''){
          this.cookieService.set('token',token)
          this.isAuthenticated = true;
          // this.authStatusListener.next(true);
          // this.saveAuthData(token);
          this.load=0
          
          this.router.navigate(["/home"]).then(()=>{
            window.location.reload()
          });
          // window.location.reload();
          // this.token=token
        }
        else{
          alert('no token')
        }
      });
  }

    logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.cookieService.delete('token')
    this.load=0
    this.router.navigate(["/login"]).then(()=>{
      window.location.reload()
    });
    
  }


}
