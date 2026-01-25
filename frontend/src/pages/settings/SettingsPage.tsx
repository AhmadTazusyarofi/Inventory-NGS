import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const { appName, appLogo, setAppName, setAppLogo, resetSettings } = useSettingsStore();
  const [tempName, setTempName] = useState(appName);
  const [tempLogo, setTempLogo] = useState(appLogo);

  const handleSave = () => {
    setAppName(tempName);
    setAppLogo(tempLogo);
    toast.success('Pengaturan berhasil disimpan');
  };

  const handleReset = () => {
    resetSettings();
    setTempName('NGS');
    setTempLogo('');
    toast.info('Pengaturan dikembalikan ke default');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola tampilan dan konfigurasi aplikasi</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pengaturan Aplikasi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Pengaturan Aplikasi
            </CardTitle>
            <CardDescription>
              Ubah nama dan logo aplikasi yang ditampilkan di sidebar dan halaman login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Nama Aplikasi</Label>
              <Input
                id="appName"
                placeholder="NGS"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Nama yang akan ditampilkan di sidebar dan login
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appLogo">URL Logo</Label>
              <Input
                id="appLogo"
                placeholder="https://example.com/logo.png"
                value={tempLogo}
                onChange={(e) => setTempLogo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                URL gambar logo (opsional, kosongkan untuk menggunakan icon default)
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Pratinjau tampilan dengan pengaturan saat ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-sidebar p-4">
              <div className="flex items-center gap-2">
                {tempLogo ? (
                  <img src={tempLogo} alt="Logo" className="h-6 w-6 object-contain" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                    {tempName.charAt(0)}
                  </div>
                )}
                <span className="text-lg font-bold text-sidebar-foreground">
                  {tempName || 'NGS'}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Sidebar akan menampilkan logo dan nama seperti di atas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
