import { Component, OnChanges } from '@angular/core';
import { RecipeServiceService } from '../recipe-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor (private recipeService : RecipeServiceService) {}
  recipeDisplay : any;
  
  viewRecipes ()
  {
    this.recipeService.getRecipes().subscribe(res =>
      {
        this.recipeDisplay = res;
      });
  }
}