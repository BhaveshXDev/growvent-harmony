import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown, Droplets, Plus, Scissors, Leaf } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Crops = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  
  const crops = [
    {
      id: 1,
      name: "Tomato",
      variety: "Roma",
      image: "/lovable-uploads/f5f42c31-36d1-4c82-8480-d54c4a7e98ca.png",
      plantedDate: "2023-09-15",
      growthStage: "Fruiting",
      growthPercentage: 75,
      wateringSchedule: "Every 2 days",
      lastWatered: "2023-10-08",
      nextWatering: "2023-10-10",
      pruningSchedule: "Every 2 weeks",
      lastPruned: "2023-09-30",
      nextPruning: "2023-10-14",
      fertilizationSchedule: "Every 3 weeks",
      lastFertilized: "2023-09-25",
      nextFertilization: "2023-10-16",
    },
    {
      id: 2,
      name: "Strawberry",
      variety: "Alpine",
      image: "/lovable-uploads/8b8489b4-720b-4aa4-8b40-dcb0e6d30c7b.png",
      plantedDate: "2023-08-20",
      growthStage: "Harvesting",
      growthPercentage: 90,
      wateringSchedule: "Every day",
      lastWatered: "2023-10-09",
      nextWatering: "2023-10-10",
      pruningSchedule: "Every month",
      lastPruned: "2023-09-20",
      nextPruning: "2023-10-20",
      fertilizationSchedule: "Every 2 weeks",
      lastFertilized: "2023-10-01",
      nextFertilization: "2023-10-15",
    },
    {
      id: 3,
      name: "Cucumber",
      variety: "English",
      image: "/lovable-uploads/2b54e8ca-7eeb-46cf-bcef-f32a94192aba.png",
      plantedDate: "2023-09-01",
      growthStage: "Flowering",
      growthPercentage: 60,
      wateringSchedule: "Every 2 days",
      lastWatered: "2023-10-08",
      nextWatering: "2023-10-10",
      pruningSchedule: "Every 3 weeks",
      lastPruned: "2023-09-25",
      nextPruning: "2023-10-16",
      fertilizationSchedule: "Every 2 weeks",
      lastFertilized: "2023-10-02",
      nextFertilization: "2023-10-16",
    },
    {
      id: 4,
      name: "Chili",
      variety: "Cayenne",
      image: "/lovable-uploads/5c549508-00e8-42a5-8998-1cc464f807d3.png",
      plantedDate: "2023-08-10",
      growthStage: "Fruiting",
      growthPercentage: 80,
      wateringSchedule: "Every 3 days",
      lastWatered: "2023-10-07",
      nextWatering: "2023-10-10",
      pruningSchedule: "Monthly",
      lastPruned: "2023-09-15",
      nextPruning: "2023-10-15",
      fertilizationSchedule: "Every 3 weeks",
      lastFertilized: "2023-09-20",
      nextFertilization: "2023-10-11",
    },
  ];

  const growthStageColors: Record<string, string> = {
    "Seedling": "bg-lime-500",
    "Vegetative": "bg-green-500",
    "Flowering": "bg-purple-500",
    "Fruiting": "bg-orange-500",
    "Harvesting": "bg-red-500",
  };

  const [selectedCrop, setSelectedCrop] = useState<(typeof crops)[0] | null>(null);
  const [viewCropDetails, setViewCropDetails] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest dark:text-lime">Crop Management</h1>
        <Button 
          className="bg-forest hover:bg-forest/90 text-white"
          onClick={() => setIsAddCropOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Crop
        </Button>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {crops.map((crop) => (
              <Card key={crop.id} className="overflow-hidden">
                <div className="relative h-48 bg-lime/10">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-contain"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${growthStageColors[crop.growthStage]}`}
                  >
                    {crop.growthStage}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{crop.name}</CardTitle>
                  <CardDescription>{crop.variety}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Growth Progress</div>
                      <Progress value={crop.growthPercentage} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Planted: {new Date(crop.plantedDate).toLocaleDateString()}</span>
                      <span>{crop.growthPercentage}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>Next: {new Date(crop.nextWatering).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCrop(crop);
                      setViewCropDetails(true);
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {crops.map((crop) => (
              <Card key={crop.id}>
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  <div className="w-full sm:w-24 h-24 flex-shrink-0">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-medium">{crop.name}</h3>
                        <p className="text-sm text-muted-foreground">{crop.variety}</p>
                      </div>
                      <Badge className={growthStageColors[crop.growthStage]}>
                        {crop.growthStage}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Growth Progress</div>
                        <Progress value={crop.growthPercentage} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-forest" />
                          <span>Planted: {new Date(crop.plantedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Next watering: {new Date(crop.nextWatering).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col justify-end gap-2 mt-2 sm:mt-0">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedCrop(crop);
                        setViewCropDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={viewCropDetails} onOpenChange={setViewCropDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCrop && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <img 
                    src={selectedCrop.image} 
                    alt={selectedCrop.name} 
                    className="w-8 h-8 object-contain"
                  />
                  {selectedCrop.name} - {selectedCrop.variety}
                </DialogTitle>
                <DialogDescription>
                  Planted on {new Date(selectedCrop.plantedDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Growth Stage</h3>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{selectedCrop.growthStage}</span>
                      <span className="text-sm font-medium">{selectedCrop.growthPercentage}%</span>
                    </div>
                    <Progress value={selectedCrop.growthPercentage} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Care Schedule</h3>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center">
                        <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                        Watering
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <p className="font-medium">{selectedCrop.wateringSchedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Watered</p>
                          <p className="font-medium">{new Date(selectedCrop.lastWatered).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Watering</p>
                          <p className="font-medium">{new Date(selectedCrop.nextWatering).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-3">
                      <Button variant="outline" size="sm" className="w-full">
                        Log Watering
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center">
                        <Scissors className="h-5 w-5 text-orange-500 mr-2" />
                        Pruning
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <p className="font-medium">{selectedCrop.pruningSchedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Pruned</p>
                          <p className="font-medium">{new Date(selectedCrop.lastPruned).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Pruning</p>
                          <p className="font-medium">{new Date(selectedCrop.nextPruning).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-3">
                      <Button variant="outline" size="sm" className="w-full">
                        Log Pruning
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center">
                        <Leaf className="h-5 w-5 text-green-500 mr-2" />
                        Fertilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <p className="font-medium">{selectedCrop.fertilizationSchedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Fertilized</p>
                          <p className="font-medium">{new Date(selectedCrop.lastFertilized).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Fertilization</p>
                          <p className="font-medium">{new Date(selectedCrop.nextFertilization).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-3">
                      <Button variant="outline" size="sm" className="w-full">
                        Log Fertilization
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCropOpen} onOpenChange={setIsAddCropOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Crop</DialogTitle>
            <DialogDescription>
              Enter details about the crop you want to add to your greenhouse.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crop-name">Crop Name</Label>
                <Input id="crop-name" placeholder="e.g., Tomato" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop-variety">Variety</Label>
                <Input id="crop-variety" placeholder="e.g., Roma" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Planting Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="growth-stage">Growth Stage</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select growth stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seedling">Seedling</SelectItem>
                  <SelectItem value="vegetative">Vegetative</SelectItem>
                  <SelectItem value="flowering">Flowering</SelectItem>
                  <SelectItem value="fruiting">Fruiting</SelectItem>
                  <SelectItem value="harvesting">Harvesting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="care-schedule">Care Schedule</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="watering" className="text-xs">Watering</Label>
                  <Select>
                    <SelectTrigger id="watering">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="2days">Every 2 days</SelectItem>
                      <SelectItem value="3days">Every 3 days</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pruning" className="text-xs">Pruning</Label>
                  <Select>
                    <SelectTrigger id="pruning">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fertilization" className="text-xs">Fertilization</Label>
                  <Select>
                    <SelectTrigger id="fertilization">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Add any additional notes about this crop" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCropOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-forest hover:bg-forest/90 text-white"
              onClick={() => setIsAddCropOpen(false)}
            >
              Add Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crops;
