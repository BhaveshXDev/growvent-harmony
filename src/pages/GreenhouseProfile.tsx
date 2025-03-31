
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Ruler, 
  Thermometer, 
  Droplets, 
  Wind, 
  Calendar, 
  Sprout
} from "lucide-react";

const GreenhouseProfile = () => {
  return (
    <div className="space-y-6">
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-greenhouse bg-cover bg-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-bold text-white">Main Greenhouse</h1>
          <div className="flex items-center mt-2 text-white/80">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Green Valley Farm, California</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Greenhouse Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Ruler className="h-4 w-4 mr-2" />
                  <span>Dimensions</span>
                </div>
                <span className="font-medium">30m x 15m</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <span className="mr-2">🏗️</span>
                  <span>Structure Type</span>
                </div>
                <span className="font-medium">Tunnel</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Built Date</span>
                </div>
                <span className="font-medium">March 2023</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <span className="mr-2">💰</span>
                  <span>Monthly Cost</span>
                </div>
                <span className="font-medium">$450</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Connected Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                  <span>Temperature Sensors</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Humidity Sensors</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wind className="h-4 w-4 mr-2 text-gray-500" />
                  <span>CO2 Sensors</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">💡</span>
                  <span>Light Sensors</span>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                  Maintenance
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sprout className="h-4 w-4 mr-2 text-ventiprimary-500" />
                  <span>Tomatoes</span>
                </div>
                <span className="text-sm">Zone 1</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sprout className="h-4 w-4 mr-2 text-ventiprimary-500" />
                  <span>Bell Peppers</span>
                </div>
                <span className="text-sm">Zone 2</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sprout className="h-4 w-4 mr-2 text-ventiprimary-500" />
                  <span>Cucumbers</span>
                </div>
                <span className="text-sm">Zone 3</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sprout className="h-4 w-4 mr-2 text-ventiprimary-500" />
                  <span>Lettuce</span>
                </div>
                <span className="text-sm">Zone 4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
          <CardDescription>
            Recent maintenance and service records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Ventilation System Service</h3>
                <p className="text-sm text-muted-foreground">
                  Cleaned and serviced all ventilation fans
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">July 10, 2025</span>
                <p className="text-xs text-muted-foreground">Technician: Mike Johnson</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Sensor Calibration</h3>
                <p className="text-sm text-muted-foreground">
                  Calibrated all temperature and humidity sensors
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">June 22, 2025</span>
                <p className="text-xs text-muted-foreground">Technician: Sarah Miller</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Structure Inspection</h3>
                <p className="text-sm text-muted-foreground">
                  Routine inspection of greenhouse structure and covering
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">May 15, 2025</span>
                <p className="text-xs text-muted-foreground">Technician: Robert Davis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GreenhouseProfile;
