import { useState, useEffect } from "react";
import {
  Menu,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { cn } from "./ui/utils";
import type {
  VendorData,
  Agreement,
  RegionalCoverage,
} from "../App";
import { INDONESIA_LOCATIONS } from "../src/data/mockLocationData";

interface VendorDetailProps {
  vendorId: string | null;
  isNewVendor: boolean;
  onBack: () => void;
}

const PAYMENT_METHODS = [
  "Bank Transfer",
  "Cash",
  "Cheque",
  "E-Wallet",
];
const AGREEMENT_TYPES = [
  "Lease Agreement",
  "Service Level Agreement",
  "Supply Agreement",
  "NDA",
];

// Helper function to calculate agreement status based on dates
const calculateAgreementStatus = (
  startDate: string,
  endDate: string,
): "Active" | "Inactive" => {
  if (!startDate || !endDate) return "Inactive";

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if today is between start and end dates (inclusive)
  if (today >= start && today <= end) {
    return "Active";
  }

  return "Inactive";
};

// Mock existing NPWPs for validation (Req 8)
const EXISTING_NPWPS = [
  "12.345.678.9-012.000",
  "98.765.432.1-321.000",
];

export function VendorDetail({
  vendorId,
  isNewVendor,
  onBack,
}: VendorDetailProps) {
  const [formData, setFormData] = useState<Partial<VendorData>>(
    {
      vendorCode: isNewVendor
        ? `VND${Date.now().toString().slice(-6)}`
        : "",
      vendorName: "",
      picName: "",
      email1: "",
      email2: "",
      regionalCoverages: [],
      address: "",
      phone: "",
      nibNumber: "",
      ktpNumber: "",
      npwpNumber: "",
      bankName: "",
      bankAccountName: "",
      bankAccountNumber: "",
      ppn: "",
      serviceCharge: "",
      pb1: "",
      paymentMethod: "",
      agreements: [],
    },
  );

  // File Names State
  const [fileNames, setFileNames] = useState({
    nib: "",
    ktp: "",
    npwp: "",
    bank: "",
  });

  // Regional Coverage Local State
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Single select now

  useEffect(() => {
    if (!isNewVendor && vendorId) {
      // Load vendor data - Mock data for demonstration
      setFormData({
        vendorCode: "VND001",
        vendorName: "PT Mitra Sejahtera",
        picName: "Budi Santoso",
        email1: "contact@mitrasejahtera.com",
        email2: "finance@mitrasejahtera.com",
        regionalCoverages: [
          {
            province: "DKI Jakarta",
            city: "Jakarta Selatan",
            districts: ["Tebet", "Setiabudi"],
          },
        ],
        address: "Jl. Sudirman No. 123, Jakarta",
        phone: "+62 21 1234567",
        nibNumber: "1234567890",
        ktpNumber: "3201234567890123",
        npwpNumber: "12.345.678.9-012.000",
        bankName: "Bank Mandiri",
        bankAccountName: "PT Mitra Sejahtera",
        bankAccountNumber: "1234567890",
        ppn: "11",
        serviceCharge: "5",
        pb1: "10",
        paymentMethod: "Bank Transfer",
        agreements: [
          {
            id: "1",
            documentNumber: "AGR-2025-001",
            agreementType: "Lease Agreement",
            startDate: "2025-01-01",
            endDate: "2026-12-31",
            status: "Active",
            file: null,
          },
        ],
      });
      setFileNames({
        ...fileNames,
        npwp: "npwp_doc.pdf",
        bank: "bank_doc.pdf",
      });
    }
  }, [vendorId, isNewVendor]);

  // --- Regional Coverage Logic ---

  // Get available cities based on selected province
  const getCitiesForProvince = () => {
    return (
      INDONESIA_LOCATIONS.find(
        (p) => p.name === selectedProvince,
      )?.cities || []
    );
  };

  // Get available districts based on selected city
  // AND filter out districts that have already been selected for this vendor
  const getAvailableDistricts = () => {
    const province = INDONESIA_LOCATIONS.find(
      (p) => p.name === selectedProvince,
    );
    const allDistricts =
      province?.cities.find((c) => c.name === selectedCity)
        ?.districts || [];

    // Find if we already have coverage for this province/city
    const existingCoverage = formData.regionalCoverages?.find(
      (cov) =>
        cov.province === selectedProvince &&
        cov.city === selectedCity,
    );

    if (!existingCoverage) return allDistricts;

    // Filter out already selected districts
    return allDistricts.filter(
      (d) => !existingCoverage.districts.includes(d),
    );
  };

  const handleAddCoverage = () => {
    if (!selectedProvince || !selectedCity || !selectedDistrict)
      return;

    const currentCoverages = [
      ...(formData.regionalCoverages || []),
    ];
    const existingIndex = currentCoverages.findIndex(
      (cov) =>
        cov.province === selectedProvince &&
        cov.city === selectedCity,
    );

    if (existingIndex >= 0) {
      // Add district to existing city coverage
      const updatedDistricts = [
        ...currentCoverages[existingIndex].districts,
        selectedDistrict,
      ];
      currentCoverages[existingIndex] = {
        ...currentCoverages[existingIndex],
        districts: updatedDistricts,
      };
    } else {
      // Create new coverage entry
      currentCoverages.push({
        province: selectedProvince,
        city: selectedCity,
        districts: [selectedDistrict],
      });
    }

    setFormData({
      ...formData,
      regionalCoverages: currentCoverages,
    });

    // Reset District selection only, keep Prov/City for faster entry of next district
    setSelectedDistrict("");
  };

  const handleRemoveDistrict = (
    province: string,
    city: string,
    district: string,
  ) => {
    const currentCoverages = [
      ...(formData.regionalCoverages || []),
    ];
    const existingIndex = currentCoverages.findIndex(
      (cov) => cov.province === province && cov.city === city,
    );

    if (existingIndex >= 0) {
      const updatedDistricts = currentCoverages[
        existingIndex
      ].districts.filter((d) => d !== district);

      if (updatedDistricts.length === 0) {
        // If no districts left, remove the whole coverage entry
        currentCoverages.splice(existingIndex, 1);
      } else {
        currentCoverages[existingIndex] = {
          ...currentCoverages[existingIndex],
          districts: updatedDistricts,
        };
      }

      setFormData({
        ...formData,
        regionalCoverages: currentCoverages,
      });
    }
  };

  const handleRemoveWholeCoverage = (index: number) => {
    const updated = [...(formData.regionalCoverages || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, regionalCoverages: updated });
  };

  // --- Agreement Logic ---
  const handleAddAgreement = () => {
    const newAgreement: Agreement = {
      id: Date.now().toString(),
      documentNumber: "",
      agreementType: "",
      startDate: "",
      endDate: "",
      status: "Inactive", // Default status
      file: null,
    };
    setFormData({
      ...formData,
      agreements: [
        ...(formData.agreements || []),
        newAgreement,
      ],
    });
  };

  const handleRemoveAgreement = (agreementId: string) => {
    setFormData({
      ...formData,
      agreements:
        formData.agreements?.filter(
          (a) => a.id !== agreementId,
        ) || [],
    });
  };

  const handleAgreementChange = (
    agreementId: string,
    field: keyof Agreement,
    value: string,
  ) => {
    const updatedAgreements = formData.agreements?.map((a) => {
      if (a.id !== agreementId) return a;

      const updatedAgreement = { ...a, [field]: value };

      // Auto-calculate status when start or end date changes
      if (field === "startDate" || field === "endDate") {
        const startDate =
          field === "startDate" ? value : a.startDate;
        const endDate = field === "endDate" ? value : a.endDate;
        updatedAgreement.status = calculateAgreementStatus(
          startDate,
          endDate,
        );
      }

      return updatedAgreement;
    });

    setFormData({
      ...formData,
      agreements: updatedAgreements,
    });
  };

  // --- File Upload Logic ---
  const handleFileUpload = (
    type: keyof typeof fileNames,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileNames((prev) => ({ ...prev, [type]: file.name }));
    }
  };

  // --- Save & Validation ---
  const handleSave = () => {
    // Validation
    if (!formData.vendorName)
      return alert("Vendor Name is required");
    if (!formData.picName) return alert("PIC Name is required"); // Req 1
    if (!formData.email1) return alert("Email 1 is required"); // Req 2
    if (!formData.email2) return alert("Email 2 is required"); // Req 2
    if (
      !formData.regionalCoverages ||
      formData.regionalCoverages.length === 0
    ) {
      return alert(
        "At least one Regional Coverage must be added",
      );
    }
    if (!formData.address) return alert("Address is required");
    if (!formData.phone) return alert("Phone is required");

    // Req 6 Validation
    if (!formData.npwpNumber)
      return alert("NPWP Number is required");
    if (!fileNames.npwp) return alert("NPWP File is required");
    if (!formData.bankName)
      return alert("Bank Name is required");
    if (!formData.bankAccountNumber)
      return alert("Bank Account Number is required");
    // Note: KTP and NIB are now optional (Req 6)

    // Req 8: Duplicate NPWP Check
    if (
      isNewVendor &&
      EXISTING_NPWPS.includes(formData.npwpNumber || "")
    ) {
      return alert(
        "This NPWP Number is already registered to another vendor.",
      );
    }

    if (
      !formData.agreements ||
      formData.agreements.length === 0
    ) {
      return alert("At least one Agreement is required");
    }

    // Save logic would go here
    alert("Vendor saved successfully!");
    onBack();
  };

  return (
    <div className="flex w-full">
      {/* Sidebar - Same as before */}
      <aside className="w-64 bg-[#2C3E50] text-white min-h-screen flex-shrink-0">
        <div className="p-4">
          <h1 className="text-white">Red Spark</h1>
        </div>
        <nav className="mt-8">
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
        {/* Header */}
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

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </div>

          <h2 className="mb-6">
            {isNewVendor
              ? "Create New Vendor"
              : "Vendor Detail"}
          </h2>

          {/* General Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Code & Name */}
              <div>
                <Label htmlFor="vendorCode">
                  Vendor Code{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vendorCode"
                  value={formData.vendorCode}
                  disabled
                  className="bg-gray-100 border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="vendorName">
                  Vendor Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vendorName: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>

              {/* Req 1: PIC Name */}
              <div>
                <Label htmlFor="picName">
                  PIC Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="picName"
                  value={formData.picName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      picName: e.target.value,
                    })
                  }
                  placeholder="Enter PIC Name"
                  className="bg-input-background border-gray-300"
                />
              </div>

              {/* Req 2: Split Email */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="email1">
                    Email 1{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email1"
                    type="email"
                    value={formData.email1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email1: e.target.value,
                      })
                    }
                    className="bg-input-background border-gray-300"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="email2">
                    Email 2{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email2"
                    type="email"
                    value={formData.email2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email2: e.target.value,
                      })
                    }
                    className="bg-input-background border-gray-300"
                  />
                </div>
              </div>

              {/* Address & Phone */}
              <div className="md:col-span-1">
                <Label htmlFor="address">
                  Address{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Req 9 & New Req 1: Regional Coverage (Cascading Single Select) */}
            <h4 className="font-medium mb-3">
              Regional Coverage
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
              <div>
                <Label className="mb-2 block">Province</Label>
                <Select
                  value={selectedProvince}
                  onValueChange={(val) => {
                    setSelectedProvince(val);
                    setSelectedCity("");
                    setSelectedDistrict("");
                  }}
                >
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDONESIA_LOCATIONS.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">
                  City / Regency
                </Label>
                <Select
                  value={selectedCity}
                  onValueChange={(val) => {
                    setSelectedCity(val);
                    setSelectedDistrict("");
                  }}
                  disabled={!selectedProvince}
                >
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCitiesForProvince().map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">District</Label>
                <Select
                  value={selectedDistrict}
                  onValueChange={(val) =>
                    setSelectedDistrict(val)
                  }
                  disabled={!selectedCity}
                >
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCity &&
                      getAvailableDistricts().map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    {selectedCity &&
                      getAvailableDistricts().length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          All districts added
                        </div>
                      )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button
                  onClick={handleAddCoverage}
                  className="w-full bg-[#17A2B8] hover:bg-[#138496] text-white"
                  disabled={
                    !selectedProvince ||
                    !selectedCity ||
                    !selectedDistrict
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
            </div>

            {/* List Selected Coverages */}
            <div className="space-y-3 mt-6">
              {formData.regionalCoverages &&
              formData.regionalCoverages.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {formData.regionalCoverages.map(
                    (cov, idx) => (
                      <div
                        key={`${cov.province}-${cov.city}`}
                        className="p-3 bg-gray-50 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-800">
                            {cov.province} &mdash; {cov.city}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveWholeCoverage(idx)
                            }
                            className="text-red-500 hover:text-red-700 h-6 px-2 text-xs"
                          >
                            Remove Region
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cov.districts.map((d) => (
                            <Badge
                              key={d}
                              variant="secondary"
                              className="text-xs flex items-center gap-1 px-2 py-1 bg-white border border-gray-200"
                            >
                              {d}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors"
                                onClick={() =>
                                  handleRemoveDistrict(
                                    cov.province,
                                    cov.city,
                                    d,
                                  )
                                }
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md text-gray-500 text-sm">
                  No regional coverage added yet.
                </div>
              )}
            </div>
          </div>

          {/* Legal and Admin Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">
              Legal and Admin Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Req 6: NPWP (Mandatory) */}
              <div>
                <Label htmlFor="npwpNumber">
                  NPWP Number{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="npwpNumber"
                  value={formData.npwpNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      npwpNumber: e.target.value,
                    })
                  }
                  placeholder="xx.xxx.xxx.x-xxx.xxx"
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="npwpFile">
                  NPWP File{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="npwpFile"
                    type="file"
                    onChange={(e) =>
                      handleFileUpload("npwp", e)
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="npwpFile"
                    className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {fileNames.npwp || "Choose file..."}
                    </span>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>

              {/* NIB & KTP (Optional) */}
              <div>
                <Label htmlFor="nibNumber">
                  NIB Number{" "}
                  <span className="text-gray-400 text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="nibNumber"
                  type="number"
                  value={formData.nibNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nibNumber: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="nibFile">
                  NIB File{" "}
                  <span className="text-gray-400 text-xs">
                    (Optional)
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="nibFile"
                    type="file"
                    onChange={(e) => handleFileUpload("nib", e)}
                    className="hidden"
                  />
                  <label
                    htmlFor="nibFile"
                    className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {fileNames.nib || "Choose file..."}
                    </span>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="ktpNumber">
                  KTP Number{" "}
                  <span className="text-gray-400 text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="ktpNumber"
                  type="number"
                  value={formData.ktpNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ktpNumber: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="ktpFile">
                  KTP File{" "}
                  <span className="text-gray-400 text-xs">
                    (Optional)
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ktpFile"
                    type="file"
                    onChange={(e) => handleFileUpload("ktp", e)}
                    className="hidden"
                  />
                  <label
                    htmlFor="ktpFile"
                    className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {fileNames.ktp || "Choose file..."}
                    </span>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>

              {/* Bank Info (Mandatory) */}
              <div>
                <Label htmlFor="bankName">
                  Bank Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankName: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="bankAccountName">
                  Bank Account Name
                </Label>
                <Input
                  id="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccountName: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="bankAccountNumber">
                  Bank Account Number{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="bankFile">Bank Document</Label>
                <div className="flex gap-2">
                  <Input
                    id="bankFile"
                    type="file"
                    onChange={(e) =>
                      handleFileUpload("bank", e)
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="bankFile"
                    className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {fileNames.bank || "Choose file..."}
                    </span>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tax and Fees */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">
              Tax and Fees Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ppn">PPN (%) *</Label>
                <Input
                  id="ppn"
                  type="number"
                  value={formData.ppn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ppn: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="serviceCharge">
                  Service Charge (%) *
                </Label>
                <Input
                  id="serviceCharge"
                  type="number"
                  value={formData.serviceCharge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceCharge: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="pb1">PB1 (%) *</Label>
                <Input
                  id="pb1"
                  type="number"
                  value={formData.pb1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pb1: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">
                  Payment Method *
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      paymentMethod: value,
                    })
                  }
                >
                  <SelectTrigger className="bg-input-background border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Agreement / Offerings (Req 5) */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h3>
                Agreement / Offerings{" "}
                <span className="text-red-500">*</span>
              </h3>
              <Button
                onClick={handleAddAgreement}
                className="bg-[#17A2B8] hover:bg-[#138496] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Agreement
              </Button>
            </div>

            <div className="space-y-6">
              {formData.agreements?.map((agreement, index) => (
                <div
                  key={agreement.id}
                  className="border border-gray-300 rounded-lg p-4 relative bg-gray-50/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sm">
                      Agreement {index + 1}
                    </h4>
                    {formData.agreements &&
                      formData.agreements.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleRemoveAgreement(agreement.id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Document Number *</Label>
                      <Input
                        value={agreement.documentNumber}
                        onChange={(e) =>
                          handleAgreementChange(
                            agreement.id,
                            "documentNumber",
                            e.target.value,
                          )
                        }
                        className="bg-white"
                      />
                    </div>
                    {/* Req 5: Agreement Type Predefined */}
                    <div>
                      <Label>Document Type *</Label>
                      <Select
                        value={agreement.agreementType}
                        onValueChange={(val) =>
                          handleAgreementChange(
                            agreement.id,
                            "agreementType",
                            val,
                          )
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGREEMENT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={agreement.startDate}
                        onChange={(e) =>
                          handleAgreementChange(
                            agreement.id,
                            "startDate",
                            e.target.value,
                          )
                        }
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={agreement.endDate}
                        onChange={(e) =>
                          handleAgreementChange(
                            agreement.id,
                            "endDate",
                            e.target.value,
                          )
                        }
                        className="bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Upload Agreement File *</Label>
                      <Input
                        type="file"
                        className="bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!formData.agreements ||
                formData.agreements.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No agreements added yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pb-10">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#17A2B8] hover:bg-[#138496] text-white"
            >
              Save Vendor
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}