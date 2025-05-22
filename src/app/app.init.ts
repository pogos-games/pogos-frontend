import {inject} from "@angular/core";
import {ConfigService} from "./services/config.service";

export async function appInit() {
  const configService = inject(ConfigService);
  await configService.loadConfig();
}
