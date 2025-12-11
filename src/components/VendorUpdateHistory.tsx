import { useState } from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import type { HistoryLog } from '../App';

interface VendorUpdateHistoryProps {
  vendorId: string | null;
  onBack: () => void;
}

// Mock history data for demonstration
const mockHistoryLogs: HistoryLog[] = [
  {
    dateTime: '2025-12-10 11:25:40 UTC',
    userEmail: 'sheila.syafni@redspark.com',
    message:
      'update $,updatedData = 2025-12-10 11:25:40 UTC, updated_at = 2025-12-10 11:25:40 UTC, update_user_id = 348)',
  },
  {
    dateTime: '2025-12-10 11:25:40 UTC',
    userEmail: 'sheila.syafni@redspark.com',
    message:
      'update $,updatedData = 2025-12-10 11:25:40 UTC, updated_at = 2025-12-10 11:25:40 UTC, update_user_id = 348)',
  },
  {
    dateTime: '2025-10-16 09:28:54 UTC',
    userEmail: 'sitiroini',
    message:
      'update $,updatedData = 2025-10-16 09:28:54 UTC, updated_at = 2025-10-16 09:28:54 UTC, update_user_id = 325)',
  },
  {
    dateTime: '2024-09-09 04:30:49 UTC',
    userEmail: 'sitiroini',
    message:
      'update $,updatedData = 2024-09-09 04:30:49 UTC, updated_at = 2024-09-09 04:30:49 UTC, encrypted_holtek = VYOxwRGdRon52hJW032EOxX0Og3FVeQOQdQ8LvsV445I8+Ugv03jRj9H3+IrDs5RQ==...dsabcBr7koRg9ar1L0P5h9U12IaJiU2067fe2yJsbi4eBxH13+e6k4obS44r1itID5J1i1oBXJJslFa9m2vltUGCNm1UbhhHr5oQg3lV0dqVh4vfvUOgS8f0qo==...8t08+8YEQi=',
  },
  {
    dateTime: '2024-09-09 04:30:31 UTC',
    userEmail: 'sitiroini',
    message:
      'sz3KxGriXy88xrvlRR1xJ23TVVKVh232EsY4Yxx0wsn4V4Xp2oi4zJlH8n0NrH38o05Jm12bC31o3Vm1Ql3LV0Gg8OlhyvV4LsH42bVzd2eCKmrV8nG0V9Zk0dIZ1JLXr1rX7Ksu3bxF5vq2cLsWk2dIlKOSC1WZuvZZ2xnWZ4tWo9L8nkG2dsxLn0D17Oaxb2vDqON4i5nTNT01gOvlZBX8xk+1idE4k4obE48kdgTI1UBT1Ql3M3UyGgpwz1vE3WGkZJj8LvsOzrZrulG38WEPGg==...b5c815a2cebd24cd148f1dd3288464b34c5c3)',
  },
  {
    dateTime: '2023-11-03 11:58:55 UTC',
    userEmail: 'sitiroini',
    message:
      'S2kDz6CdKgvoxO0XtsI1Nog8aKshxoOw5KZNbWei5cRhr1hUva3o2i7kvSKV+dkLH19kbXE8kEEhvkx02i2vZr03i1Vsv50LDqFrXtYPuLlzQNzmz7Z0tVZWVdZ+G5Evn1kxK0J3WG0+f4V4zXcu1lgRU1VBZ6kkZIdIULI11mXWfvq3xoQWKds+Vo==...b5c815a2cebd24cd148f1dd3288464b34c5c3)',
  },
  {
    dateTime: '2023-10-16 07:14:04 UTC',
    userEmail: 'sitiroini',
    message: 'update $,updatedData = 2023-10-16 07:14:04 UTC, updated_at = 2023-10-16 07:14:04 UTC)',
  },
  {
    dateTime: '2023-10-16 07:14:04 UTC',
    userEmail: 'sitiroini',
    message: 'update $,updatedData = 2023-10-16 07:14:04 UTC, updated_at = 2023-10-16 07:14:04 UTC, update_user_id = 325)',
  },
];

export function VendorUpdateHistory({ vendorId, onBack }: VendorUpdateHistoryProps) {
  const [showEntries, setShowEntries] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockHistoryLogs.filter(
    (log) =>
      log.dateTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <main className="flex-1 bg-gray-50 p-6">
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

          <h2 className="mb-6">Vendor Update History</h2>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
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

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Search:</span>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-64 bg-input-background border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[200px]">Date/Time</TableHead>
                  <TableHead className="w-[250px]">User Email</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="align-top">
                        {log.dateTime}
                      </TableCell>
                      <TableCell className="align-top">
                        {log.userEmail}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="break-words max-w-2xl">{log.message}</div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No history records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredLogs.length} of {mockHistoryLogs.length} entries
          </div>
        </main>
      </div>
    </div>
  );
}
