import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Droplets, Plus, Scissors, Leaf, Loader2, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  name: z.string().min(1, "Crop name is required"),
  variety: z.string().optional(),
  plantedDate: z.date(),
  growthStage: z.string(),
  wateringSchedule: z.string(),
  pruningSchedule: z.string(),
  fertilizationSchedule: z.string(),
  notes: z.string().optional(),
});

const Crops = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [viewCropDetails, setViewCropDetails] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      variety: "",
      plantedDate: new Date(),
      growthStage: "Seedling",
      wateringSchedule: "Every 2 days",
      pruningSchedule: "Every 2 weeks",
      fertilizationSchedule: "Every 3 weeks",
      notes: "",
    },
  });

  const fetchCrops = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("crops")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setCrops(data || []);
    } catch (error: any) {
      console.error("Error fetching crops:", error.message);
      toast({
        title: "Error",
        description: "Failed to load crops. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [user]);

  // Function to fetch crop image based on name - simplified to just set a default image
  const fetchCropImage = (cropName: string): string => {
    const cropNameLower = cropName.toLowerCase();
    
    if (cropNameLower.includes("tomato")) {
      return "/lovable-uploads/2b54e8ca-7eeb-46cf-bcef-f32a94192aba.png";
    } else if (cropNameLower.includes("strawberry")) {
      return "/lovable-uploads/8b8489b4-720b-4aa4-8b40-dcb0e6d30c7b.png";
    } else if (cropNameLower.includes("cucumber")) {
      return "/lovable-uploads/f5f42c31-36d1-4c82-8480-d54c4a7e98ca.png";
    } else if (cropNameLower.includes("chili") || cropNameLower.includes("pepper")) {
      return "/lovable-uploads/5c549508-00e8-42a5-8998-1cc464f807d3.png";
    } else {
      // Default plant image
      return "/lovable-uploads/2b54e8ca-7eeb-46cf-bcef-f32a94192aba.png";
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add a crop",
          variant: "destructive",
        });
        return;
      }

      const cropData = {
        user_id: user.id,
        name: values.name,
        variety: values.variety || null,
        planted_date: values.plantedDate.toISOString().split('T')[0],
        growth_stage: values.growthStage,
        growth_percentage: getGrowthPercentage(values.growthStage),
        watering_schedule: values.wateringSchedule,
        pruning_schedule: values.pruningSchedule,
        fertilization_schedule: values.fertilizationSchedule,
        notes: values.notes || null,
        // Calculate initial dates for watering/pruning/fertilization
        last_watered: new Date().toISOString().split('T')[0],
        next_watering: calculateNextDate(values.wateringSchedule).toISOString().split('T')[0],
        last_pruned: new Date().toISOString().split('T')[0],
        next_pruning: calculateNextDate(values.pruningSchedule).toISOString().split('T')[0],
        last_fertilized: new Date().toISOString().split('T')[0],
        next_fertilization: calculateNextDate(values.fertilizationSchedule).toISOString().split('T')[0],
        // Set the image from the fetched image
        image: fetchCropImage(values.name),
      };

      const { error } = await supabase.from("crops").insert([cropData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${values.name} has been added to your crops`,
      });

      form.reset();
      setIsAddCropOpen(false);
      fetchCrops();
    } catch (error: any) {
      console.error("Error adding crop:", error.message);
      toast({
        title: "Error",
        description: "Failed to add crop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getGrowthPercentage = (stage: string): number => {
    switch (stage) {
      case "Seedling": return 20;
      case "Vegetative": return 40;
      case "Flowering": return 60;
      case "Fruiting": return 80;
      case "Harvesting": return 95;
      default: return 0;
    }
  };

  const calculateNextDate = (schedule: string): Date => {
    const today = new Date();
    const nextDate = new Date(today);
    
    if (schedule.includes("day")) {
      const days = parseInt(schedule.match(/\d+/)?.[0] || "1");
      nextDate.setDate(today.getDate() + days);
    } else if (schedule.includes("week")) {
      const weeks = parseInt(schedule.match(/\d+/)?.[0] || "1");
      nextDate.setDate(today.getDate() + (weeks * 7));
    } else if (schedule.includes("month")) {
      const months = parseInt(schedule.match(/\d+/)?.[0] || "1");
      nextDate.setMonth(today.getMonth() + months);
    }
    
    return nextDate;
  };

  const getDefaultCropImage = (cropName: string): string => {
    const cropNameLower = cropName.toLowerCase();
    
    if (cropNameLower.includes("tomato")) {
      return "/lovable-uploads/2b54e8ca-7eeb-46cf-bcef-f32a94192aba.png";
    } else if (cropNameLower.includes("strawberry")) {
      return "/lovable-uploads/8b8489b4-720b-4aa4-8b40-dcb0e6d30c7b.png";
    } else if (cropNameLower.includes("cucumber")) {
      return "/lovable-uploads/f5f42c31-36d1-4c82-8480-d54c4a7e98ca.png";
    } else if (cropNameLower.includes("chili") || cropNameLower.includes("pepper")) {
      return "/lovable-uploads/5c549508-00e8-42a5-8998-1cc464f807d3.png";
    } else {
      // Default plant image
      return "/lovable-uploads/2b54e8ca-7eeb-46cf-bcef-f32a94192aba.png";
    }
  };

  const handleLogCareActivity = async (cropId: string, activityType: 'watering' | 'pruning' | 'fertilization') => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const crop = crops.find(c => c.id === cropId);
      
      if (!crop) return;
      
      let updateData: Record<string, any> = {};
      
      if (activityType === 'watering') {
        const nextWatering = calculateNextDate(crop.watering_schedule).toISOString().split('T')[0];
        updateData = {
          last_watered: today,
          next_watering: nextWatering
        };
      } else if (activityType === 'pruning') {
        const nextPruning = calculateNextDate(crop.pruning_schedule).toISOString().split('T')[0];
        updateData = {
          last_pruned: today,
          next_pruning: nextPruning
        };
      } else if (activityType === 'fertilization') {
        const nextFertilization = calculateNextDate(crop.fertilization_schedule).toISOString().split('T')[0];
        updateData = {
          last_fertilized: today,
          next_fertilization: nextFertilization
        };
      }
      
      const { error } = await supabase
        .from('crops')
        .update(updateData)
        .eq('id', cropId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} logged successfully`,
      });
      
      fetchCrops();
      
      // Update the selected crop if it's currently being viewed
      if (selectedCrop && selectedCrop.id === cropId) {
        setSelectedCrop({...selectedCrop, ...updateData});
      }
      
    } catch (error: any) {
      console.error(`Error logging ${activityType}:`, error.message);
      toast({
        title: "Error",
        description: `Failed to log ${activityType}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const growthStageColors: Record<string, string> = {
    "Seedling": "bg-lime-500",
    "Vegetative": "bg-green-500",
    "Flowering": "bg-purple-500",
    "Fruiting": "bg-orange-500",
    "Harvesting": "bg-red-500",
  };

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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading crops...</span>
          </div>
        ) : crops.length === 0 ? (
          <div className="text-center py-16 border rounded-lg bg-muted/20">
            <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No crops yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first crop to track</p>
            <Button 
              className="bg-forest hover:bg-forest/90 text-white"
              onClick={() => setIsAddCropOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Crop
            </Button>
          </div>
        ) : (
          <>
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {crops.map((crop) => (
                  <Card key={crop.id} className="overflow-hidden">
                    <div className="relative h-48 bg-lime/10">
                      <img
                        src={crop.image || getDefaultCropImage(crop.name)}
                        alt={crop.name}
                        className="w-full h-full object-contain"
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${growthStageColors[crop.growth_stage] || "bg-gray-500"}`}
                      >
                        {crop.growth_stage}
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
                          <Progress value={crop.growth_percentage} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Planted: {new Date(crop.planted_date).toLocaleDateString()}</span>
                          <span>{crop.growth_percentage}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Next: {new Date(crop.next_watering).toLocaleDateString()}</span>
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
                          src={crop.image || getDefaultCropImage(crop.name)}
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
                          <Badge className={growthStageColors[crop.growth_stage] || "bg-gray-500"}>
                            {crop.growth_stage}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Growth Progress</div>
                            <Progress value={crop.growth_percentage} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-forest" />
                              <span>Planted: {new Date(crop.planted_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              <span>Next watering: {new Date(crop.next_watering).toLocaleDateString()}</span>
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
          </>
        )}
      </Tabs>

      <Dialog open={viewCropDetails} onOpenChange={setViewCropDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCrop && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <img 
                    src={selectedCrop.image || getDefaultCropImage(selectedCrop.name)} 
                    alt={selectedCrop.name} 
                    className="w-8 h-8 object-contain"
                  />
                  {selectedCrop.name} - {selectedCrop.variety}
                </DialogTitle>
                <DialogDescription>
                  Planted on {new Date(selectedCrop.planted_date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Growth Stage</h3>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{selectedCrop.growth_stage}</span>
                      <span className="text-sm font-medium">{selectedCrop.growth_percentage}%</span>
                    </div>
                    <Progress value={selectedCrop.growth_percentage} className="h-2" />
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
                          <p className="font-medium">{selectedCrop.watering_schedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Watered</p>
                          <p className="font-medium">{new Date(selectedCrop.last_watered).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Watering</p>
                          <p className="font-medium">{new Date(selectedCrop.next_watering).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleLogCareActivity(selectedCrop.id, 'watering')}
                      >
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
                          <p className="font-medium">{selectedCrop.pruning_schedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Pruned</p>
                          <p className="font-medium">{new Date(selectedCrop.last_pruned).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Pruning</p>
                          <p className="font-medium">{new Date(selectedCrop.next_pruning).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleLogCareActivity(selectedCrop.id, 'pruning')}
                      >
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
                          <p className="font-medium">{selectedCrop.fertilization_schedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Fertilized</p>
                          <p className="font-medium">{new Date(selectedCrop.last_fertilized).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Fertilization</p>
                          <p className="font-medium">{new Date(selectedCrop.next_fertilization).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleLogCareActivity(selectedCrop.id, 'fertilization')}
                      >
                        Log Fertilization
                      </Button>
                    </CardFooter>
                  </Card>

                  {selectedCrop.notes && (
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedCrop.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCropOpen} onOpenChange={setIsAddCropOpen}>
        <DialogContent className="max-w-md w-full overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Crop</DialogTitle>
            <DialogDescription>
              Enter details about the crop you want to add to your greenhouse.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tomato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="variety"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variety</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Roma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="plantedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Planting Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="growthStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Growth Stage</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select growth stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Seedling">Seedling</SelectItem>
                        <SelectItem value="Vegetative">Vegetative</SelectItem>
                        <SelectItem value="Flowering">Flowering</SelectItem>
                        <SelectItem value="Fruiting">Fruiting</SelectItem>
                        <SelectItem value="Harvesting">Harvesting</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label>Care Schedule</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="wateringSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Watering</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Every 2 days">Every 2 days</SelectItem>
                            <SelectItem value="Every 3 days">Every 3 days</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pruningSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Pruning</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Every 2 weeks">Every 2 weeks</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fertilizationSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Fertilization</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Every 2 weeks">Every 2 weeks</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes about your crop..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-2">
                <Button type="submit" className="w-full">Add Crop</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crops;
