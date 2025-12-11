import { useState, useMemo } from "react";
import { Menu, Download } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { VendorData, Agreement } from "../App";

interface VendorAgreementListProps {
  onViewVendor: (vendorId: string) => void;
  onCreateNewVendor: () => void;
  onViewHistory: (vendorId: string) => void;
}

// Helper function to calculate agreement status based on dates
const calculateAgreementStatus = (
  startDate: string,
  endDate: string,
): "Active" | "Inactive" => {
  if (!startDate || !endDate) return "Inactive";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today >= start && today <= end) {
    return "Active";
  }

  return "Inactive";
};

// Mock data (Updated structure)
const mockVendors: VendorData[] = [
  {
    id: "1",
    createDate: "10 Dec 2025",
    vendorCode: "VND001",
    vendorName: "PT Mitra Sejahtera",
    picName: "Budi",
    email1: "a@a.com",
    email2: "b@b.com",
    address: "Jkt",
    phone: "123",
    regionalCoverages: [],
    npwpNumber: "123",
    npwpFile: null,
    bankName: "BCA",
    bankAccountName: "PT Mitra",
    bankAccountNumber: "111",
    ppn: "11",
    serviceCharge: "5",
    pb1: "10",
    paymentMethod: "Transfer",
    agreements: [
      {
        id: "a1",
        documentNumber: "VA001",
        agreementType: "Lease",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: calculateAgreementStatus("2025-01-01", "2025-12-31"),
        file: null,
      },
      {
        id: "a2",
        documentNumber: "VA002",
        agreementType: "Service",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        status: calculateAgreementStatus("2026-01-01", "2026-12-31"),
        file: null,
      },
    ],
  },
  {
    id: "2",
    createDate: "09 Dec 2025",
    vendorCode: "VND002",
    vendorName: "CV Berkah Jaya",
    picName: "Siti",
    email1: "c@c.com",
    email2: "d@d.com",
    address: "Bali",
    phone: "456",
    regionalCoverages: [],
    npwpNumber: "456",
    npwpFile: null,
    bankName: "Mandiri",
    bankAccountName: "CV Berkah",
    bankAccountNumber: "222",
    ppn: "11",
    serviceCharge: "5",
    pb1: "10",
    paymentMethod: "Transfer",
    agreements: [
      {
        id: "b1",
        documentNumber: "VA003",
        agreementType: "Supply",
        startDate: "2025-06-01",
        endDate: "2026-06-30",
        status: calculateAgreementStatus("2025-06-01", "2026-06-30"),
        file: null,
      },
    ],
  },
];

const COUNTRIES = [
  "Indonesia",
  "Philippines",
  "Singapore",
  "Vietnam",
  "Thailand",
];

// Req 7 & 3: Updated Filter Keys
const FILTER_KEYS = [
  "Create Date",
  "Agreement Number",
  "Vendor Code",
  "Vendor Name",
  "Start Date",
  "End Date",
  "Agreement Status",
];

// Helper type for flattened row
interface AgreementRow {
  vendorId: string;
  createDate: string;
  vendorCode: string;
  vendorName: string;
  agreement: Agreement;
}

export function VendorAgreementList({
  onViewVendor,
  onCreateNewVendor,
  onViewHistory,
}: VendorAgreementListProps) {
  const [country, setCountry] = useState("Indonesia");
  const [filterKey, setFilterKey] = useState("Vendor Name");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showEntries, setShowEntries] = useState("10");

  // Req 4: Flatten Data (1 Row per Agreement)
  const flattenedData: AgreementRow[] = useMemo(() => {
    return mockVendors.flatMap((vendor) =>
      vendor.agreements.map((agreement) => ({
        vendorId: vendor.id,
        createDate: vendor.createDate,
        vendorCode: vendor.vendorCode,
        vendorName: vendor.vendorName,
        agreement: agreement,
      })),
    );
  }, []);

  const filteredData = flattenedData.filter((row) => {
    if (!searchKeyword) return true;
    const lowerSearch = searchKeyword.toLowerCase();
    // Simple mock search implementation
    return (
      row.vendorName.toLowerCase().includes(lowerSearch) ||
      row.vendorCode.toLowerCase().includes(lowerSearch) ||
      row.agreement.documentNumber
        .toLowerCase()
        .includes(lowerSearch)
    );
  });

  return (
    <div className="flex w-full">
      {/* Sidebar - Same as before */}
      <aside className="w-64 bg-[#2C3E50] text-white min-h-screen flex-shrink-0">
        <div className="p-4">
          <h1 className="text-white">Red Spark</h1>
        </div>
        <nav className="mt-8">
          {/* Navigation Items (Truncated for brevity, same as previous) */}
          <div className="px-4 py-2">
            <button className="flex items-center justify-between w-full text-left text-white hover:bg-[#34495E] px-3 py-2 rounded">
              <span>Master</span>
            </button>
            <div className="ml-4 mt-2 space-y-1">
              <a
                href="#"
                className="block text-white bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Vendor Agreement
              </a>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-teal-500">
              Marvel Sublekti Sulastri
            </span>
            <Button className="bg-[#E74C3C] hover:bg-[#C0392B] text-white">
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <h2 className="mb-6">Vendor Agreement</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Select
                  value={country}
                  onValueChange={setCountry}
                >
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
              <div>
                <Select
                  value={filterKey}
                  onValueChange={setFilterKey}
                >
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
              <div>
                <Input
                  placeholder="Enter search keywords"
                  value={searchKeyword}
                  onChange={(e) =>
                    setSearchKeyword(e.target.value)
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-[#17A2B8] hover:bg-[#138496] text-white">
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchKeyword("")}
                  className="border-gray-300"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Show
                </span>
                <Select
                  value={showEntries}
                  onValueChange={setShowEntries}
                >
                  <SelectTrigger className="w-20 bg-input-background border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  entries
                </span>
              </div>
              <div className="flex gap-2">
                <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black">
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

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {/* Req 7: Updated Columns */}
                  <TableHead>Create Date</TableHead>
                  <TableHead>Agreement No</TableHead>
                  <TableHead>Vendor Code</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Agreement Status</TableHead>
                  <TableHead className="text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow
                      key={`${row.vendorId}-${row.agreement.id}-${index}`}
                    >
                      <TableCell>{row.createDate}</TableCell>
                      <TableCell className="text-teal-500">
                        {row.agreement.documentNumber}
                      </TableCell>
                      <TableCell>{row.vendorCode}</TableCell>
                      <TableCell>{row.vendorName}</TableCell>
                      <TableCell>
                        {row.agreement.startDate}
                      </TableCell>
                      <TableCell>
                        {row.agreement.endDate}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-sm ${
                            row.agreement.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {row.agreement.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="link"
                            onClick={() =>
                              onViewVendor(row.vendorId)
                            }
                            className="text-teal-500 hover:text-teal-700"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="link"
                            onClick={() =>
                              onViewHistory(row.vendorId)
                            }
                            className="text-teal-500 hover:text-teal-700"
                          >
                            History
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}