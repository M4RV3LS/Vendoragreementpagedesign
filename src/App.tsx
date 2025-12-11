import { useState } from 'react';
import { VendorAgreementList } from './components/VendorAgreementList';
import { VendorDetail } from './components/VendorDetail';
import { VendorUpdateHistory } from './components/VendorUpdateHistory';

export type PageView = 'list' | 'detail' | 'history';

export interface VendorData {
  id: string;
  createDate: string;
  agreementNo: string;
  vendorCode: string;
  vendorName: string;
  dateFrom: string;
  dateTo: string;
  vendorStatus: string;
  regions: string[];
  email: string;
  address: string;
  phone: string;
  nibNumber?: string;
  nibFile?: File | null;
  ktpNumber?: string;
  ktpFile?: File | null;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankFile?: File | null;
  ppn: string;
  serviceCharge: string;
  pb1: string;
  paymentMethod: string;
  agreements: Agreement[];
}

export interface Agreement {
  id: string;
  documentNumber: string;
  startDate: string;
  endDate: string;
  file: File | null;
}

export interface HistoryLog {
  dateTime: string;
  userEmail: string;
  message: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('list');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [isNewVendor, setIsNewVendor] = useState(false);

  const handleViewVendor = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setIsNewVendor(false);
    setCurrentPage('detail');
  };

  const handleCreateNewVendor = () => {
    setSelectedVendorId(null);
    setIsNewVendor(true);
    setCurrentPage('detail');
  };

  const handleViewHistory = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setCurrentPage('history');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedVendorId(null);
    setIsNewVendor(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {currentPage === 'list' && (
        <VendorAgreementList
          onViewVendor={handleViewVendor}
          onCreateNewVendor={handleCreateNewVendor}
          onViewHistory={handleViewHistory}
        />
      )}
      {currentPage === 'detail' && (
        <VendorDetail
          vendorId={selectedVendorId}
          isNewVendor={isNewVendor}
          onBack={handleBackToList}
        />
      )}
      {currentPage === 'history' && (
        <VendorUpdateHistory
          vendorId={selectedVendorId}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}
