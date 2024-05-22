import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    add(a: number, b: number, callback: (value: number) => void) : void;
    getString(): Promise<string>;
    writeFile(name: string, content: string): Promise<string>;
    getEnv(key: string): string;
    getConstants() : {
        API_URL: string;
        WSS_URL: string;
        TERMS_OF_USE: string;
    };
    showToastNotification(label: string, value: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'MainModule',
) as Spec;
