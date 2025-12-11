import { useState } from 'react';
import { Menu, Search, Download } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import type { VendorData } from '../App';

interface VendorAgreementListProps {
  onViewVendor: (vendorId: string) => void;
  onCreateNewVendor: () => void;
  onViewHistory: (vendorId: string) => void;
}

// Mock data for demonstration
const mockVendors: VendorData[] = [
  {
    id: '1',
    createDate: '10 Dec 2025',
    agreementNo: 'VA001231',
    vendorCode: 'VND001',
    vendorName: 'PT Mitra Sejahtera',
    dateFrom: '01 Dec 2025',
    dateTo: '31 Dec 2026',
    vendorStatus: 'Active',
    regions: ['DKI Jakarta', 'Jawa Barat'],
    email: 'contact@mitrasejahtera.com',
    address: 'Jl. Sudirman No. 123, Jakarta',
    phone: '+62 21 1234567',
    ppn: '11',
    serviceCharge: '5',
    pb1: '10',
    paymentMethod: 'Bank Transfer',
    agreements: [],
  },
  {
    id: '2',
    createDate: '09 Dec 2025',
    agreementNo: 'VA001230',
    vendorCode: 'VND002',
    vendorName: 'CV Berkah Jaya',
    dateFrom: '01 Dec 2025',
    dateTo: '30 Jun 2026',
    vendorStatus: 'Active',
    regions: ['Bali', 'Nusa Tenggara Barat'],
    email: 'info@berkahjaya.com',
    address: 'Jl. Raya Denpasar No. 45, Bali',
    phone: '+62 361 987654',
    ppn: '11',
    serviceCharge: '7',
    pb1: '10',
    paymentMethod: 'Bank Transfer',
    agreements: [],
  },
];

const COUNTRIES = ['Indonesia', 'Philippines', 'Singapore', 'Vietnam', 'Thailand'];
const FILTER_KEYS = [
  'Create Date',
  'Agreement No',
  'Vendor Code',
  'Vendor Name',
  'Date From',
  'Date To',
  'Vendor Status',
];

export function VendorAgreementList({
  onViewVendor,
  onCreateNewVendor,
  onViewHistory,
}: VendorAgreementListProps) {
  const [country, setCountry] = useState('Indonesia');
  const [filterKey, setFilterKey] = useState('Vendor Name');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  const handleExportToExcel = () => {
    // Export functionality would be implemented here
    alert('Exporting to Excel...');
  };

  const handleSearch = () => {
    // Search functionality would be implemented here
    console.log('Searching:', { country, filterKey, searchKeyword });
  };

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2C3E50] text-white min-h-screen flex-shrink-0">
        <div className="p-4">
          <h1 className="text-white">Red Spark</h1>
        </div>

        <nav className="mt-8">
          <div className="px-4 py-2">
            <button className="flex items-center justify-between w-full text-left text-white hover:bg-[#34495E] px-3 py-2 rounded">
              <span>Master</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="ml-4 mt-2 space-y-1">
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Property & Agreement
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Bottom Rates
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Approval Level One
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Approval Level Two
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Approval Level Three
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Bottom Rate Approval
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Finance Approval
              </a>
              <a
                href="#"
                className="block text-white bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Vendor Agreement
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white hover:bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Country
              </a>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-teal-500">Marvel Sublekti Sulastri</span>
            <Button className="bg-[#E74C3C] hover:bg-[#C0392B] text-white">
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 p-6">
          <h2 className="mb-6">Vendor Agreement</h2>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Country Filter */}
              <div>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-input-background border-gray-300">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Key */}
              <div>
                <Select value={filterKey} onValueChange={setFilterKey}>
                  <SelectTrigger className="bg-input-background border-gray-300">
                    <SelectValue placeholder="Select Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Keyword */}
              <div>
                <Input
                  placeholder="Enter search keywords"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="bg-input-background border-gray-300"
                />
              </div>

              {/* Search & Reset Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="bg-[#17A2B8] hover:bg-[#138496] text-white"
                >
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchKeyword('')}
                  className="border-gray-300"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <Select value={showEntries} onValueChange={setShowEntries}>
                  <SelectTrigger className="w-20 bg-input-background border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">entries</span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleExportToExcel}
                  className="bg-[#FFC107] hover:bg-[#FFB300] text-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  EXPORT ALL TO EXCEL
                </Button>
                <Button
                  onClick={onCreateNewVendor}
                  className="bg-[#17A2B8] hover:bg-[#138496] text-white"
                >
                  Create New Vendor
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[100px]">Create Date</TableHead>
                  <TableHead>Agreement No</TableHead>
                  <TableHead>Vendor Code</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Date From</TableHead>
                  <TableHead>Date To</TableHead>
                  <TableHead>Vendor Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.createDate}</TableCell>
                    <TableCell className="text-teal-500">
                      {vendor.agreementNo}
                    </TableCell>
                    <TableCell>{vendor.vendorCode}</TableCell>
                    <TableCell>{vendor.vendorName}</TableCell>
                    <TableCell>{vendor.dateFrom}</TableCell>
                    <TableCell>{vendor.dateTo}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                        {vendor.vendorStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => onViewVendor(vendor.id)}
                          className="text-teal-500 hover:text-teal-700"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => onViewHistory(vendor.id)}
                          className="text-teal-500 hover:text-teal-700"
                        >
                          History
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
