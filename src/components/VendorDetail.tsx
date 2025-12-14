import { useState, useEffect } from "react";
import {
  Menu,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// Combobox imports
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "./ui/utils";
import type { VendorData, Agreement, VendorType } from "../App";
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

const VENDOR_TYPES: VendorType[] = [
  "Corporation",
  "Individual Entrepreneurs",
  "Overseas Corporation",
];

// Predefined List of Banks
const BANK_OPTIONS = [
  "Bank BCA",
  "Bank Mandiri",
  "Bank BNI",
  "Bank BRI",
  "Bank CIMB Niaga",
  "Bank Danamon",
  "Bank Permata",
  "Bank Panin",
  "Bank OCBC NISP",
  "Bank BTN",
  "Bank BSI (Syariah Indonesia)",
  "Citibank",
  "Standard Chartered",
  "Bank Mega",
  "Bank HSBC",
  "Bank DBS",
  "Bank UOB",
  "Bank Maybank",
  "Bank Sinarmas",
  "Bank Bukopin",
].sort();

// Helper to calculate agreement status
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

// Mock existing NPWPs for validation
const EXISTING_NPWPS = [
  "12.345.678.9-012.000",
  "98.765.432.1-321.000",
];

export function VendorDetail({
  vendorId,
  isNewVendor,
  onBack,
}: VendorDetailProps) {
  // Main Form State
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

      // Legal & Admin defaults
      vendorType: "Corporation", // Default
      nibNumber: "",
      ktpNumber: "",
      npwpNumber: "",
      sppkpNumber: "",
      deedNumber: "",
      sbuNumber: "",
      constructionNumber: "",
      localTaxRegNumber: "",
      corNumber: "",
      gptcNumber: "",

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

  // State to track uploaded file names (for UI display)
  const [fileNames, setFileNames] = useState<
    Record<string, string>
  >({});

  // Regional Coverage Local State
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Bank Popover State
  const [openBank, setOpenBank] = useState(false);

  // --- Load Initial Data ---
  useEffect(() => {
    if (!isNewVendor && vendorId) {
      // Mock Data Load
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
        vendorType: "Corporation",
        nibNumber: "1234567890",
        ktpNumber: "",
        npwpNumber: "12.345.678.9-012.000",
        sppkpNumber: "SPPKP-001",
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
        npwp: "npwp_doc.pdf",
        sppkp: "sppkp_doc.pdf",
        bank: "bank_doc.pdf",
        nib: "nib_doc.pdf",
      });
    }
  }, [vendorId, isNewVendor]);

  // --- Helpers for Regional Coverage ---
  const getCitiesForProvince = () =>
    INDONESIA_LOCATIONS.find((p) => p.name === selectedProvince)
      ?.cities || [];

  const getAvailableDistricts = () => {
    const province = INDONESIA_LOCATIONS.find(
      (p) => p.name === selectedProvince,
    );
    const allDistricts =
      province?.cities.find((c) => c.name === selectedCity)
        ?.districts || [];
    const existingCoverage = formData.regionalCoverages?.find(
      (cov) =>
        cov.province === selectedProvince &&
        cov.city === selectedCity,
    );
    if (!existingCoverage) return allDistricts;
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
      const updatedDistricts = [
        ...currentCoverages[existingIndex].districts,
        selectedDistrict,
      ];
      currentCoverages[existingIndex] = {
        ...currentCoverages[existingIndex],
        districts: updatedDistricts,
      };
    } else {
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
    setSelectedDistrict("");
  };

  const handleRemoveDistrict = (
    prov: string,
    city: string,
    dist: string,
  ) => {
    const currentCoverages = [
      ...(formData.regionalCoverages || []),
    ];
    const idx = currentCoverages.findIndex(
      (cov) => cov.province === prov && cov.city === city,
    );
    if (idx >= 0) {
      const updated = currentCoverages[idx].districts.filter(
        (d) => d !== dist,
      );
      if (updated.length === 0) {
        currentCoverages.splice(idx, 1);
      } else {
        currentCoverages[idx] = {
          ...currentCoverages[idx],
          districts: updated,
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

  // --- Helpers for Agreements ---
  const handleAddAgreement = () => {
    const newAgreement: Agreement = {
      id: Date.now().toString(),
      documentNumber: "",
      agreementType: "",
      startDate: "",
      endDate: "",
      status: "Inactive",
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

  const handleRemoveAgreement = (id: string) => {
    setFormData({
      ...formData,
      agreements:
        formData.agreements?.filter((a) => a.id !== id) || [],
    });
  };

  const handleAgreementChange = (
    id: string,
    field: keyof Agreement,
    value: string,
  ) => {
    const updated = formData.agreements?.map((a) => {
      if (a.id !== id) return a;
      const newA = { ...a, [field]: value };
      if (field === "startDate" || field === "endDate") {
        newA.status = calculateAgreementStatus(
          field === "startDate" ? value : a.startDate,
          field === "endDate" ? value : a.endDate,
        );
      }
      return newA;
    });
    setFormData({ ...formData, agreements: updated });
  };

  // --- Helper for File Upload ---
  const handleFileUpload = (
    fieldKey: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileNames((prev) => ({
        ...prev,
        [fieldKey]: file.name,
      }));
    }
  };

  // --- Dynamic Mandatory Logic based on Vendor Type ---
  const isMandatory = (fieldKey: string): boolean => {
    const type = formData.vendorType;

    // Common Mandatory for all (Bank Info)
    if (
      [
        "bankName",
        "bankAccountName",
        "bankAccountNumber",
        "bankFile",
      ].includes(fieldKey)
    ) {
      return true;
    }

    if (type === "Corporation") {
      const mandatoryFields = [
        "npwpNumber",
        "npwpFile",
        "sppkpNumber",
        "sppkpFile", // SPPKP / Non PKP
        "nibNumber",
        "nibFile",
      ];
      return mandatoryFields.includes(fieldKey);
    }

    if (type === "Individual Entrepreneurs") {
      const mandatoryFields = [
        "ktpNumber",
        "ktpFile",
        "npwpNumber",
        "npwpFile",
        "sppkpNumber",
        "sppkpFile", // Non PKP
        "nibNumber",
        "nibFile",
      ];
      return mandatoryFields.includes(fieldKey);
    }

    if (type === "Overseas Corporation") {
      return true; // All fields mandatory
    }

    return false;
  };

  // --- Reusable Component for Document Fields ---
  const DocumentField = ({
    label,
    numberKey,
    fileKey,
    placeholder = "",
  }: {
    label: string;
    numberKey?: keyof VendorData;
    fileKey: string;
    placeholder?: string;
  }) => {
    const numberMandatory = numberKey
      ? isMandatory(numberKey)
      : false;
    const fileMandatory = isMandatory(fileKey);

    return (
      <div className="space-y-2">
        <Label className="font-medium">
          {label}{" "}
          {(numberMandatory || fileMandatory) && (
            <span className="text-red-500">*</span>
          )}
        </Label>

        {numberKey && (
          <Input
            value={(formData[numberKey] as string) || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                [numberKey]: e.target.value,
              })
            }
            placeholder={placeholder}
            className="bg-input-background border-gray-300 mb-2"
          />
        )}

        <div className="flex gap-2">
          <Input
            id={fileKey}
            type="file"
            onChange={(e) => handleFileUpload(fileKey, e)}
            className="hidden"
          />
          <label
            htmlFor={fileKey}
            className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
          >
            <span className="text-sm text-gray-500 truncate max-w-[200px]">
              {fileNames[fileKey] || "Choose file..."}
            </span>
            <Upload className="w-4 h-4 text-gray-400" />
          </label>
        </div>
      </div>
    );
  };

  // --- Save & Validation ---
  const handleSave = () => {
    // 1. Basic Validation
    if (!formData.vendorName)
      return alert("Vendor Name is required");
    if (!formData.picName) return alert("PIC Name is required");
    if (!formData.email1) return alert("Email 1 is required");
    if (!formData.email2) return alert("Email 2 is required");
    if (!formData.regionalCoverages?.length)
      return alert("Regional Coverage required");
    if (!formData.address) return alert("Address is required");
    if (!formData.phone) return alert("Phone is required");
    if (!formData.vendorType)
      return alert("Vendor Type is required");

    // 2. Dynamic Legal Validation
    const type = formData.vendorType;
    const errors: string[] = [];

    const check = (key: keyof VendorData, name: string) => {
      // @ts-ignore
      if (
        isMandatory(key as string) &&
        !formData[key] &&
        !fileNames[key]
      ) {
        errors.push(`${name} is required for ${type}`);
      }
    };

    check("bankName", "Bank Name");
    check("bankAccountName", "Bank Account Name");
    check("bankAccountNumber", "Bank Account Number");

    if (
      isMandatory("bankFile") &&
      !fileNames["bankFile"] &&
      !formData.bankFile
    ) {
      if (isNewVendor)
        errors.push("Bank Document File is required");
    }

    if (type === "Corporation") {
      check("npwpNumber", "NPWP Number");
      if (isNewVendor && !fileNames["npwpFile"])
        errors.push("NPWP File is required");
      check("sppkpNumber", "SPPKP Number");
      if (isNewVendor && !fileNames["sppkpFile"])
        errors.push("SPPKP/Non-PKP File is required");
      check("nibNumber", "NIB Number");
      if (isNewVendor && !fileNames["nibFile"])
        errors.push("NIB File is required");
    }

    if (type === "Individual Entrepreneurs") {
      check("ktpNumber", "KTP Number");
      if (isNewVendor && !fileNames["ktpFile"])
        errors.push("KTP File is required");
      check("npwpNumber", "NPWP Number");
      if (isNewVendor && !fileNames["npwpFile"])
        errors.push("NPWP File is required");
      check("sppkpNumber", "Non PKP Number");
      if (isNewVendor && !fileNames["sppkpFile"])
        errors.push("Non PKP File is required");
      check("nibNumber", "NIB Number");
      if (isNewVendor && !fileNames["nibFile"])
        errors.push("NIB File is required");
    }

    if (type === "Overseas Corporation") {
      const overseasChecks: [
        keyof VendorData,
        string,
        string,
      ][] = [
        ["npwpNumber", "NPWP Number", "npwpFile"],
        ["sppkpNumber", "SPPKP Number", "sppkpFile"],
        ["nibNumber", "NIB Number", "nibFile"],
        ["ktpNumber", "KTP Number", "ktpFile"],
        ["deedNumber", "Deed Number", "deedFile"],
        ["sbuNumber", "SBU Number", "sbuFile"],
        [
          "constructionNumber",
          "Construction License",
          "constructionFile",
        ],
        [
          "localTaxRegNumber",
          "Local Tax Reg",
          "localTaxRegFile",
        ],
        ["corNumber", "COR Number", "corFile"],
        ["gptcNumber", "GPTC Number", "gptcFile"],
      ];

      overseasChecks.forEach(([numKey, label, fileKey]) => {
        check(numKey, label);
        if (isNewVendor && !fileNames[fileKey])
          errors.push(`${label} File is required`);
      });
      if (isNewVendor && !fileNames["otherLicenseFile"])
        errors.push("Other Business License File is required");
    }

    if (errors.length > 0) {
      alert(
        "Please fix the following errors:\n\n" +
          errors.join("\n"),
      );
      return;
    }

    if (
      isNewVendor &&
      EXISTING_NPWPS.includes(formData.npwpNumber || "")
    ) {
      return alert("This NPWP Number is already registered.");
    }

    if (
      !formData.agreements ||
      formData.agreements.length === 0
    ) {
      return alert("At least one Agreement is required");
    }

    alert("Vendor saved successfully!");
    onBack();
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
              <div>
                <Label>
                  Vendor Code{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.vendorCode}
                  disabled
                  className="bg-gray-100 border-gray-300"
                />
              </div>
              <div>
                <Label>
                  Vendor Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
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
              <div>
                <Label>
                  PIC Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.picName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      picName: e.target.value,
                    })
                  }
                  className="bg-input-background border-gray-300"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>
                    Email 1{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
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
                  <Label>
                    Email 2{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
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
              <div>
                <Label>
                  Address{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
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
                <Label>
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
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
                  onValueChange={setSelectedDistrict}
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

            <div className="space-y-3 mt-6">
              {formData.regionalCoverages?.map((cov, idx) => (
                <div
                  key={`${cov.province}-${cov.city}`}
                  className="p-3 bg-gray-50 flex flex-col gap-2 border rounded-md"
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
              ))}
            </div>
          </div>

          {/* Legal and Admin Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">
              Legal and Admin Information
            </h3>

            {/* Vendor Type Selection */}
            <div className="mb-6 max-w-md">
              <Label className="mb-2 block">
                Vendor Type{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.vendorType}
                onValueChange={(val: VendorType) =>
                  setFormData({ ...formData, vendorType: val })
                }
              >
                <SelectTrigger className="bg-input-background border-gray-300">
                  <SelectValue placeholder="Select Vendor Type" />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <DocumentField
                label="NPWP"
                numberKey="npwpNumber"
                fileKey="npwpFile"
                placeholder="xx.xxx.xxx.x-xxx.xxx"
              />

              <DocumentField
                label={
                  formData.vendorType ===
                  "Individual Entrepreneurs"
                    ? "Non PKP Document"
                    : "SPPKP / Non PKP"
                }
                numberKey="sppkpNumber"
                fileKey="sppkpFile"
              />

              <DocumentField
                label="NIB"
                numberKey="nibNumber"
                fileKey="nibFile"
              />

              <DocumentField
                label="KTP"
                numberKey="ktpNumber"
                fileKey="ktpFile"
              />

              <DocumentField
                label="Notarial Deed of Establishment"
                numberKey="deedNumber"
                fileKey="deedFile"
              />

              <DocumentField
                label="SBU (Sertifikat Badan Usaha)"
                numberKey="sbuNumber"
                fileKey="sbuFile"
              />

              <DocumentField
                label="Construction Business License"
                numberKey="constructionNumber"
                fileKey="constructionFile"
              />

              <DocumentField
                label="Other Business License"
                fileKey="otherLicenseFile"
              />

              <DocumentField
                label="Reg. Business in Local Tax"
                numberKey="localTaxRegNumber"
                fileKey="localTaxRegFile"
              />

              <DocumentField
                label="COR (Cert. of Owner's Rep)"
                numberKey="corNumber"
                fileKey="corFile"
              />

              <DocumentField
                label="GPTC"
                numberKey="gptcNumber"
                fileKey="gptcFile"
              />
            </div>

            <Separator className="my-6" />
            <h4 className="font-medium mb-4">
              Bank Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Name Dropdown with Search */}
              <div className="flex flex-col gap-2">
                <Label>
                  Bank Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Popover
                  open={openBank}
                  onOpenChange={setOpenBank}
                >
                  <PopoverTrigger
                    type="button"
                    role="combobox"
                    aria-expanded={openBank}
                    className={cn(
                      "flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-input-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      !formData.bankName &&
                        "text-muted-foreground",
                    )}
                  >
                    {formData.bankName
                      ? formData.bankName
                      : "Select bank..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  {/* Added side="bottom" to force position below the field */}
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] min-w-[300px] p-0"
                    align="start"
                    side="bottom"
                  >
                    <Command>
                      <CommandInput placeholder="Search bank..." />
                      <CommandList>
                        <CommandEmpty>
                          No bank found.
                        </CommandEmpty>
                        <CommandGroup>
                          {BANK_OPTIONS.map((bank) => (
                            <CommandItem
                              key={bank}
                              value={bank}
                              onSelect={() => {
                                setFormData({
                                  ...formData,
                                  bankName: bank,
                                });
                                setOpenBank(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.bankName === bank
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {bank}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>
                  Bank Name Account (Holder){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
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

              <DocumentField
                label="Bank Account Number"
                numberKey="bankAccountNumber"
                fileKey="bankFile"
              />
            </div>
          </div>

          {/* Tax and Fees */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">
              Tax and Fees Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>PPN (%) *</Label>
                <Input
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
                <Label>Service Charge (%) *</Label>
                <Input
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
                <Label>PB1 (%) *</Label>
                <Input
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
                <Label>Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      paymentMethod: val,
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

          {/* Agreement / Offerings */}
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
                <Plus className="w-4 h-4 mr-2" /> Add Agreement
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
                          <Trash2 className="w-4 h-4 mr-2" />{" "}
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