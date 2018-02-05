import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { routerStateReducer } from './+state/router-state.reducer';
import { routerStateInitialState } from './+state/router-state.init';
import { RouterStateEffects } from './+state/router-state.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('routerState', routerStateReducer, {initialState: routerStateInitialState}),
    EffectsModule.forFeature([RouterStateEffects])
  ],
  providers: [RouterStateEffects]
})
export class RouterStateModule {
}
