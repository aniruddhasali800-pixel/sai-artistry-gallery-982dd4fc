import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import PlaceOrder from "./pages/PlaceOrder";
import Upcoming from "./pages/Upcoming";
import UpcomingDetail from "./pages/UpcomingDetail";
import Sold from "./pages/Sold";
import ThreeDView from "./pages/ThreeDView";
import ThreeDDetail from "./pages/ThreeDDetail";
import Floating3DButton from "./components/Floating3DButton";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminSales from "./pages/admin/AdminSales";
import AdminUpcoming from "./pages/admin/AdminUpcoming";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminPaintings3D from "./pages/admin/AdminPaintings3D";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/upcoming/:id" element={<UpcomingDetail />} />
          <Route path="/sold" element={<Sold />} />
          <Route path="/3d-view" element={<ThreeDView />} />
          <Route path="/3d-view/:id" element={<ThreeDDetail />} />
          <Route path="/place-order/:id" element={<PlaceOrder />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="upcoming" element={<AdminUpcoming />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="3d-paintings" element={<AdminPaintings3D />} />
            <Route path="sales" element={<AdminSales />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Floating3DButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
