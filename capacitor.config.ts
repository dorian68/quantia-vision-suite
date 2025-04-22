
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a97ded2920c044eb90f3e9c7313c9802',
  appName: 'quantia-vision-suite',
  webDir: 'dist',
  server: {
    url: 'https://a97ded29-20c0-44eb-90f3-e9c7313c9802.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
