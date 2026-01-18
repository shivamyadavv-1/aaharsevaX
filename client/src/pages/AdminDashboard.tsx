import { useDonations } from "@/hooks/use-donations";
import { useNgoRequests } from "@/hooks/use-ngo-requests";
import { useInventory } from "@/hooks/use-inventory";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin, Phone, Database, Clock } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: donations, isLoading: loadingDonations } = useDonations();
  const { data: requests, isLoading: loadingRequests } = useNgoRequests();
  const { data: inventory, isLoading: loadingInventory } = useInventory();

  if (loadingDonations || loadingRequests || loadingInventory) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-12 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor real-time food donations and NGO requests.</p>
          </div>
          <div className="flex gap-4">
            <Card className="p-4 flex flex-col items-center bg-primary/10 border-primary/20">
              <span className="text-2xl font-bold text-primary">{donations?.length || 0}</span>
              <span className="text-xs text-primary/80 uppercase font-bold tracking-wider">Donations</span>
            </Card>
            <Card className="p-4 flex flex-col items-center bg-secondary/10 border-secondary/20">
              <span className="text-2xl font-bold text-secondary">{requests?.length || 0}</span>
              <span className="text-xs text-secondary/80 uppercase font-bold tracking-wider">Requests</span>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="w-full md:w-auto p-1 h-12 rounded-xl bg-muted/50 border border-border/50">
            <TabsTrigger value="donations" className="h-10 rounded-lg text-base px-6">Donations</TabsTrigger>
            <TabsTrigger value="requests" className="h-10 rounded-lg text-base px-6">NGO Requests</TabsTrigger>
            <TabsTrigger value="inventory" className="h-10 rounded-lg text-base px-6">Food Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>List of all food donation offers received.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDonations ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : donations?.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No donations found.</div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="w-[180px]">Donor</TableHead>
                          <TableHead>Food Type</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations?.map((d) => (
                          <TableRow key={d.id} className="hover:bg-muted/5">
                            <TableCell className="font-medium">{d.donorName}</TableCell>
                            <TableCell>
                              <Badge variant={d.foodType === 'Cooked' ? 'default' : 'outline'} className={d.foodType === 'Cooked' ? 'bg-orange-500 hover:bg-orange-600' : ''}>
                                {d.foodType}
                              </Badge>
                            </TableCell>
                            <TableCell>{d.quantity}</TableCell>
                            <TableCell>
                              <div className="flex flex-col text-sm">
                                <span className="font-medium">{d.city}</span>
                                <span className="text-muted-foreground text-xs">{d.area}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" /> {d.contactNumber}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {d.createdAt && format(new Date(d.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">
                                {d.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>NGO Requests</CardTitle>
                <CardDescription>Food requirements submitted by NGOs.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
                ) : requests?.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No requests found.</div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="w-[200px]">NGO Name</TableHead>
                          <TableHead>Requirements</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests?.map((r) => (
                          <TableRow key={r.id} className="hover:bg-muted/5">
                            <TableCell className="font-medium">{r.ngoName}</TableCell>
                            <TableCell className="max-w-md truncate" title={r.requirements}>
                              {r.requirements}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" /> {r.city}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" /> {r.contactNumber}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {r.createdAt && format(new Date(r.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 uppercase text-[10px] tracking-wider">
                                {r.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>Live Food Inventory</CardTitle>
                <CardDescription>Available items that are fresh and undelivered.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInventory ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : !inventory || inventory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No available food items in inventory.</div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>Donor</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Safe Until</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventory.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/5">
                            <TableCell className="font-medium">{item.donorName}</TableCell>
                            <TableCell>
                              <Badge variant={item.foodType === 'Cooked' ? 'default' : 'outline'} className={item.foodType === 'Cooked' ? 'bg-orange-500 hover:bg-orange-600' : ''}>
                                {item.foodType}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" /> {item.city}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {item.safeUntil ? format(new Date(item.safeUntil), 'p') : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 uppercase text-[10px] tracking-wider">
                                {item.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
