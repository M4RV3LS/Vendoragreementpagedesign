import { useState, useEffect } from 'react';
import { Menu, Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { VendorData, Agreement } from '../App';

interface VendorDetailProps {
  vendorId: string | null;
  isNewVendor: boolean;
  onBack: () => void;
}

const INDONESIA_PROVINCES = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Selatan',
  'Papua Barat Daya',
];

const PAYMENT_METHODS = ['Bank Transfer', 'Cash', 'Cheque', 'E-Wallet'];

export function VendorDetail({ vendorId, isNewVendor, onBack }: VendorDetailProps) {
  const [formData, setFormData] = useState<Partial<VendorData>>({
    vendorCode: isNewVendor ? `VND${Date.now().toString().slice(-6)}` : '',
    vendorName: '',
    regions: [],
    email: '',
    address: '',
    phone: '',
    nibNumber: '',
    ktpNumber: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    ppn: '',
    serviceCharge: '',
    pb1: '',
    paymentMethod: '',
    agreements: [],
  });

  const [nibFileName, setNibFileName] = useState('');
  const [ktpFileName, setKtpFileName] = useState('');
  const [bankFileName, setBankFileName] = useState('');

  useEffect(() => {
    if (!isNewVendor && vendorId) {
      // Load vendor data - Mock data for demonstration
      setFormData({
        vendorCode: 'VND001',
        vendorName: 'PT Mitra Sejahtera',
        regions: ['DKI Jakarta', 'Jawa Barat'],
        email: 'contact@mitrasejahtera.com',
        address: 'Jl. Sudirman No. 123, Jakarta',
        phone: '+62 21 1234567',
        nibNumber: '1234567890',
        ktpNumber: '3201234567890123',
        bankName: 'Bank Mandiri',
        bankAccountName: 'PT Mitra Sejahtera',
        bankAccountNumber: '1234567890',
        ppn: '11',
        serviceCharge: '5',
        pb1: '10',
        paymentMethod: 'Bank Transfer',
        agreements: [
          {
            id: '1',
            documentNumber: 'AGR-2025-001',
            startDate: '2025-01-01',
            endDate: '2026-12-31',
            file: null,
          },
        ],
      });
    }
  }, [vendorId, isNewVendor]);

  const handleRegionToggle = (province: string) => {
    const newRegions = formData.regions?.includes(province)
      ? formData.regions.filter((r) => r !== province)
      : [...(formData.regions || []), province];
    setFormData({ ...formData, regions: newRegions });
  };

  const handleAddAgreement = () => {
    const newAgreement: Agreement = {
      id: Date.now().toString(),
      documentNumber: '',
      startDate: '',
      endDate: '',
      file: null,
    };
    setFormData({
      ...formData,
      agreements: [...(formData.agreements || []), newAgreement],
    });
  };

  const handleRemoveAgreement = (agreementId: string) => {
    setFormData({
      ...formData,
      agreements: formData.agreements?.filter((a) => a.id !== agreementId) || [],
    });
  };

  const handleAgreementChange = (
    agreementId: string,
    field: keyof Agreement,
    value: string
  ) => {
    setFormData({
      ...formData,
      agreements: formData.agreements?.map((a) =>
        a.id === agreementId ? { ...a, [field]: value } : a
      ),
    });
  };

  const handleFileUpload = (
    type: 'nib' | 'ktp' | 'bank',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'nib') setNibFileName(file.name);
      if (type === 'ktp') setKtpFileName(file.name);
      if (type === 'bank') setBankFileName(file.name);
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.vendorName) {
      alert('Vendor Name is required');
      return;
    }
    if (!formData.regions || formData.regions.length === 0) {
      alert('At least one Region must be selected');
      return;
    }
    if (!formData.email) {
      alert('Email is required');
      return;
    }
    if (!formData.address) {
      alert('Address is required');
      return;
    }
    if (!formData.phone) {
      alert('Phone is required');
      return;
    }
    if (!formData.ppn || !formData.serviceCharge || !formData.pb1 || !formData.paymentMethod) {
      alert('All Tax and Fees Configuration fields are required');
      return;
    }
    if (!formData.agreements || formData.agreements.length === 0) {
      alert('At least one Agreement is required');
      return;
    }

    // Save logic would go here
    alert('Vendor saved successfully!');
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
                className="block text-white bg-[#34495E] px-3 py-2 rounded text-sm"
              >
                Vendor Agreement
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
            {isNewVendor ? 'Create New Vendor' : 'Vendor Detail'}
          </h2>

          {/* General Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">General Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="vendorCode">
                  Vendor Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vendorCode"
                  value={formData.vendorCode}
                  disabled
                  className="bg-gray-100 border-gray-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Generated Automatically
                </p>
              </div>

              <div>
                <Label htmlFor="vendorName">
                  Vendor Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) =>
                    setFormData({ ...formData, vendorName: e.target.value })
                  }
                  placeholder="Enter vendor name"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div className="md:col-span-2">
                <Label>
                  Regions <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-4 bg-input-background">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INDONESIA_PROVINCES.map((province) => (
                      <div key={province} className="flex items-center space-x-2">
                        <Checkbox
                          id={province}
                          checked={formData.regions?.includes(province)}
                          onCheckedChange={() => handleRegionToggle(province)}
                        />
                        <label
                          htmlFor={province}
                          className="text-sm cursor-pointer"
                        >
                          {province}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
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
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter full address"
                  className="bg-input-background border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Legal and Admin Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">Legal and Admin Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nibNumber">NIB Number</Label>
                <Input
                  id="nibNumber"
                  type="number"
                  value={formData.nibNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, nibNumber: e.target.value })
                  }
                  placeholder="Enter NIB number"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="nibFile">NIB File Upload</Label>
                <div className="flex gap-2">
                  <Input
                    id="nibFile"
                    type="file"
                    onChange={(e) => handleFileUpload('nib', e)}
                    className="hidden"
                  />
                  <label
                    htmlFor="nibFile"
                    className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {nibFileName || 'Choose file...'}
                    </span>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="ktpNumber">KTP Number</Label>
                <Input
                  id="ktpNumber"
                  type="number"
                  value={formData.ktpNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, ktpNumber: e.target.value })
                  }
                  placeholder="Enter KTP number"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="ktpFile">KTP Document</Label>
                <div className="flex gap-2">
                  <Input
                    id="ktpFile"
                    type="file"
                    onChange={(e) => handleFileUpload('ktp', e)}
                    className="hidden"
                  />
                  <label
                    htmlFor="ktpFile"
                    className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {ktpFileName || 'Choose file...'}
                    </span>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  placeholder="Enter bank name"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="bankAccountName">Bank Account Name</Label>
                <Input
                  id="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccountName: e.target.value })
                  }
                  placeholder="Enter account name"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccountNumber: e.target.value })
                  }
                  placeholder="Enter account number"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="bankFile">Bank Document File Upload</Label>
                <div className="flex gap-2">
                  <Input
                    id="bankFile"
                    type="file"
                    onChange={(e) => handleFileUpload('bank', e)}
                    className="hidden"
                  />
                  <label
                    htmlFor="bankFile"
                    className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {bankFileName || 'Choose file...'}
                    </span>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tax and Fees Configuration */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="mb-4 pb-2 border-b">Tax and Fees Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ppn">
                  PPN (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ppn"
                  type="number"
                  value={formData.ppn}
                  onChange={(e) =>
                    setFormData({ ...formData, ppn: e.target.value })
                  }
                  placeholder="0.0"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="serviceCharge">
                  Service Charge (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serviceCharge"
                  type="number"
                  value={formData.serviceCharge}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceCharge: e.target.value })
                  }
                  placeholder="0.0"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="pb1">
                  PB1 (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pb1"
                  type="number"
                  value={formData.pb1}
                  onChange={(e) =>
                    setFormData({ ...formData, pb1: e.target.value })
                  }
                  placeholder="0.0"
                  className="bg-input-background border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">
                  Payment Method <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger className="bg-input-background border-gray-300">
                    <SelectValue placeholder="Please Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
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
                Agreement / Offerings <span className="text-red-500">*</span>
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
                  className="border border-gray-300 rounded-lg p-4 relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4>Agreement {index + 1}</h4>
                    {formData.agreements && formData.agreements.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveAgreement(agreement.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`docNumber-${agreement.id}`}>
                        Document Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`docNumber-${agreement.id}`}
                        value={agreement.documentNumber}
                        onChange={(e) =>
                          handleAgreementChange(
                            agreement.id,
                            'documentNumber',
                            e.target.value
                          )
                        }
                        placeholder="Enter document number"
                        className="bg-input-background border-gray-300"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`startDate-${agreement.id}`}>
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`startDate-${agreement.id}`}
                        type="date"
                        value={agreement.startDate}
                        onChange={(e) =>
                          handleAgreementChange(
                            agreement.id,
                            'startDate',
                            e.target.value
                          )
                        }
                        className="bg-input-background border-gray-300"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`endDate-${agreement.id}`}>
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`endDate-${agreement.id}`}
                        type="date"
                        value={agreement.endDate}
                        onChange={(e) =>
                          handleAgreementChange(
                            agreement.id,
                            'endDate',
                            e.target.value
                          )
                        }
                        className="bg-input-background border-gray-300"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`agreementFile-${agreement.id}`}>
                        Upload Agreement Files <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`agreementFile-${agreement.id}`}
                          type="file"
                          className="hidden"
                        />
                        <label
                          htmlFor={`agreementFile-${agreement.id}`}
                          className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-input-background cursor-pointer hover:bg-gray-100"
                        >
                          <span className="text-sm text-gray-500">
                            Choose file...
                          </span>
                          <Upload className="w-4 h-4 text-gray-400" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(!formData.agreements || formData.agreements.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No agreements added yet. Click "Add Agreement" to create one.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onBack} className="border-gray-300">
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
