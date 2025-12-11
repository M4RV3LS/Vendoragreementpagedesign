import { useState } from "react";
import { VendorAgreementList } from "./components/VendorAgreementList";
import { VendorDetail } from "./components/VendorDetail";
import { VendorUpdateHistory } from "./components/VendorUpdateHistory";

export type PageView = "list" | "detail" | "history";

// Helper type for Regional Coverage
export interface RegionalCoverage {
  province: string;
  city: string;
  districts: string[]; // List of selected districts
}

export interface Agreement {
  id: string;
  documentNumber: string;
  agreementType: string; // Req 5
  startDate: string;
  endDate: string;
  status: string; // Req 7
  file: File | null;
}

export interface VendorData {
  id: string;
  createDate: string;
  vendorCode: string;
  vendorName: string;
  picName: string; // Req 1

  // Req 2: Split Email
  email1: string;
  email2: string;

  address: string;
  phone: string;

  // Req 9: Regional Coverage (Replaces simple region array)
  regionalCoverages: RegionalCoverage[];

  // Req 6: Admin Info updates
  nibNumber?: string;
  nibFile?: File | null;
  ktpNumber?: string;
  ktpFile?: File | null;

  npwpNumber: string; // Req 6 Mandatory
  npwpFile: File | null; // Req 6 Mandatory

  bankName: string; // Req 6 Mandatory
  bankAccountName: string;
  bankAccountNumber: string; // Req 6 Mandatory
  bankFile?: File | null;

  ppn: string;
  serviceCharge: string;
  pb1: string;
  paymentMethod: string;

  agreements: Agreement[];
}

export interface HistoryLog {
  dateTime: string;
  userEmail: string;
  message: string;
}

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<PageView>("list");
  const [selectedVendorId, setSelectedVendorId] = useState<
    string | null
  >(null);
  const [isNewVendor, setIsNewVendor] = useState(false);

  const handleViewVendor = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setIsNewVendor(false);
    setCurrentPage("detail");
  };

  const handleCreateNewVendor = () => {
    setSelectedVendorId(null);
    setIsNewVendor(true);
    setCurrentPage("detail");
  };

  const handleViewHistory = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setCurrentPage("history");
  };

  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedVendorId(null);
    setIsNewVendor(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {currentPage === "list" && (
        <VendorAgreementList
          onViewVendor={handleViewVendor}
          onCreateNewVendor={handleCreateNewVendor}
          onViewHistory={handleViewHistory}
        />
      )}
      {currentPage === "detail" && (
        <VendorDetail
          vendorId={selectedVendorId}
          isNewVendor={isNewVendor}
          onBack={handleBackToList}
        />
      )}
      {currentPage === "history" && (
        <VendorUpdateHistory
          vendorId={selectedVendorId}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}