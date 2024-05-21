import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    add(a: number, b: number, callback: (value: number) => void) : void;
    getString(): Promise<string>;
    writeFile(name: string, content: string): Promise<string>;
    getEnv(key: string): Promise<string>;
}

export default TurboModuleRegistry.get<Spec>(
  'MainModule',
) as Spec | null;
