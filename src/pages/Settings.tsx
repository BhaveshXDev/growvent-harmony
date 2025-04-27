
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Bell, Languages, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("settings.loggedOut"),
        description: t("settings.loggedOutDescription"),
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("i18nextLng", value);
    toast({
      title: t("settings.languageChanged"),
      description: t("settings.languageChangedDescription"),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t("settings.language")}
          </CardTitle>
          <CardDescription>
            {t("settings.languageDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={i18n.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder={t("settings.selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="mr">मराठी (Marathi)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t("settings.notifications")}
          </CardTitle>
          <CardDescription>
            {t("settings.notificationsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="app-notifications">{t("settings.appNotifications")}</Label>
            <Switch
              id="app-notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-emails">{t("settings.marketingEmails")}</Label>
            <Switch
              id="marketing-emails"
              defaultChecked={false}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.security")}
          </CardTitle>
          <CardDescription>
            {t("settings.securityDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="security-alerts">{t("settings.securityAlerts")}</Label>
            <Switch
              id="security-alerts"
              checked={securityAlerts}
              onCheckedChange={setSecurityAlerts}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="two-factor">{t("settings.twoFactor")}</Label>
            <Switch
              id="two-factor"
              defaultChecked={false}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{t("settings.accountManagement")}</CardTitle>
          <CardDescription>
            {t("settings.accountSettings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-medium mb-2">{t("common.logout")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("settings.logoutText")}
              </p>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {t("common.logout")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
