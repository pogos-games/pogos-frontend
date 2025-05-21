import {inject, Injectable} from '@angular/core';
import {EnvConfig} from "../model/config/env.config.interface";
import {HttpBackend, HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ConfigService {

  private _environmentConfig: EnvConfig  = { CORE_URL: '', GAMES_URL: '' };

  private readonly http: HttpClient;

  constructor() {
    const httpHandler = inject(HttpBackend);
    this.http = new HttpClient(httpHandler);
  }

  public async loadConfig() {
    return firstValueFrom(this.http.get<EnvConfig>('./assets/config.json')).then(
      (config) => {
        this._environmentConfig = config;
      }
    );
  }


  get config(): EnvConfig {
    return this._environmentConfig;
  }

}
