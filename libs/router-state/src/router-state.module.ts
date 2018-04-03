import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { RouterModule } from '@angular/router';

// external imports
import { EffectsModule } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

import { CustomSerializer } from './services/custom-serializer.service';
import { RouterEffects } from './+state/router-state.effects';

@NgModule()
export class RouterStateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootRouterStateModule,
      providers: [
        { provide: RouterStateSerializer, useClass: CustomSerializer }
      ]
    };
  }
}

@NgModule({
  imports: [
    StoreModule.forFeature('router', routerReducer),
    EffectsModule.forFeature([RouterEffects]),
    StoreRouterConnectingModule,
  ]
})
export class RootRouterStateModule {}

