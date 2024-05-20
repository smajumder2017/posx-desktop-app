import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IPrinter } from '@/models/printer';
import { useEffect, useState } from 'react';
import * as apis from '@/apis';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { posXDB, Printer } from '@/db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Printers = () => {
  const [openAddPinter, setOpenAddPrinter] = useState(false);
  const [printers, setPrinters] = useState<IPrinter[]>([]);
  const [selectedPrinterType, setSelectedPrinterType] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [selectedPrinterLocation, setSelectedPrinterLocation] = useState('');
  const [printerIP, setPrinterIP] = useState('');
  const savedPrinters = useLiveQuery(() => posXDB.printers.toArray());
  const [printerStatus, setPrinterStatus] = useState<{
    [key: string]: boolean;
  }>();

  const getPrinters = async () => {
    try {
      const res = await apis.getPrinters();
      setPrinters(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  async function addPrinter() {
    try {
      // Add the new friend!
      const res = await apis.getPrinterStatus({
        type: selectedPrinterType,
        value: selectedPrinterType === 'network' ? printerIP : selectedPrinter,
      });
      if (!res.data.status) {
        throw new Error('Printer not connected');
      }
      await posXDB.printers.add({
        printerValue:
          selectedPrinterType === 'network'
            ? `tcp://${printerIP}`
            : `printer:${selectedPrinter}`,
        printerType: selectedPrinterType,
        printerLocation: selectedPrinterLocation,
      });

      handleOnAddPrinterOpenChange(false);
    } catch (error) {
      console.log(error);
    }
  }

  const getPrinterStatus = async (printers: Printer[]) => {
    const statuses = await Promise.all(
      printers.map(async (printer) => {
        const res = await apis.getPrinterStatus({
          type: printer.printerType,
          value:
            printer.printerType === 'network'
              ? printer.printerValue.replace('tcp://', '')
              : printer.printerValue.replace('printer:', ''),
        });
        return { value: printer.printerValue, status: res.data.status };
      }),
    );
    const printerStats = statuses.reduce(
      (acc: { [key: string]: boolean }, curr) => {
        acc[curr.value] = curr.status;
        return acc;
      },
      {},
    );

    setPrinterStatus(printerStats);
  };

  const handleOnAddPrinterOpenChange = (value: boolean) => {
    setSelectedPrinter('');
    setSelectedPrinterType('');
    setSelectedPrinterLocation('');
    setOpenAddPrinter(value);
  };

  useEffect(() => {
    getPrinters();
  }, []);

  useEffect(() => {
    getPrinterStatus(savedPrinters || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedPrinters?.length]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button onClick={() => setOpenAddPrinter(true)}>Add printer</Button>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Printers</CardTitle>
          <CardDescription>List of configured printers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedPrinters?.map((printer) => (
                <TableRow key={printer.id}>
                  <TableCell>{printer.printerType.toUpperCase()}</TableCell>
                  <TableCell className="font-medium">
                    {printer.printerType === 'network'
                      ? printer.printerValue.replace('tcp://', '')
                      : printer.printerValue.replace('printer:', '')}
                  </TableCell>
                  <TableCell>{printer.printerLocation}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        printerStatus?.[printer.printerValue]
                          ? 'bg-green-600'
                          : ''
                      }`}
                      variant={
                        printerStatus?.[printer.printerValue]
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {printerStatus?.[printer.printerValue]
                        ? 'Online'
                        : 'Offline'}
                    </Badge>
                  </TableCell>
                  <TableCell>abc</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={openAddPinter} onOpenChange={handleOnAddPrinterOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add printer</DialogTitle>
            <DialogDescription>
              Make sure your printer is connected
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-0.5">
              <Label>Printer Location</Label>
              <Select
                onValueChange={setSelectedPrinterLocation}
                value={selectedPrinterLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a printer location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Printer Location</SelectLabel>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-0.5">
              <Label>Printer type</Label>
              <Select
                onValueChange={setSelectedPrinterType}
                value={selectedPrinterType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a printer to configure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Printer Type</SelectLabel>
                    <SelectItem value="network">Network printer</SelectItem>
                    <SelectItem value="local" disabled={!printers.length}>
                      Local printer
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectedPrinterType === 'network' && (
              <div className="space-y-0.5">
                <Label htmlFor="printerip">Printer IP</Label>
                <Input
                  id="printerip"
                  placeholder="Enter printer ip address"
                  onChange={(e) => {
                    setPrinterIP(e.target.value);
                  }}
                  value={printerIP}
                />
              </div>
            )}
            {selectedPrinterType === 'local' && (
              <div className="space-y-0.5">
                <Label>Local printers</Label>
                <Select
                  onValueChange={setSelectedPrinter}
                  value={selectedPrinter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a printer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Printers</SelectLabel>
                      {printers.map((printer) => {
                        return (
                          <SelectItem id={printer.name} value={printer.name}>
                            {printer.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={addPrinter}>Add printer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Printers;
