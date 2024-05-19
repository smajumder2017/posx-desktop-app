import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IPrinter } from "@/models/printer";
import { useEffect, useState } from "react";
import * as apis from "@/apis";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { posXDB } from "@/db/db";
import {useLiveQuery} from "dexie-react-hooks";

const Printers = () => {
  const [openAddPinter, setOpenAddPrinter] = useState(false);
  const [printers, setPrinters] = useState<IPrinter[]>([]);
  const [selectedPrinterType, setSelectedPrinterType] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [selectedPrinterLocation, setSelectedPrinterLocation] = useState("");
  const savedPrinters = useLiveQuery(() => posXDB.printers.toArray());

  const getPrinters = async () => {
    try {
      const res = await apis.getPrinters();
      setPrinters(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addPrinter() {
    try {
      // Add the new friend!
      await posXDB.printers.add({
        printerValue: selectedPrinterType === 'network' ? `tcp://${selectedPrinter}`: `printer:${selectedPrinter}`,
        printerType: selectedPrinterType,
        printerLocation: selectedPrinterLocation
      });

      handleOnAddPrinterOpenChange(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOnAddPrinterOpenChange = (value: boolean) => {
    setSelectedPrinter("");
    setSelectedPrinterType("");
    setSelectedPrinterLocation("")
    setOpenAddPrinter(value);
  }


  useEffect(() => {
    getPrinters();
  }, []);


  return <div className="flex flex-col">
    <div>
      <Button onClick={() => setOpenAddPrinter(true)}>Add printer</Button>
    </div>
    <div>
      {
        savedPrinters?.map(printer => {
          return <div key={printer.id}>{printer.printerValue}</div>
        })
      }
    </div>
    <Dialog open={openAddPinter} onOpenChange={handleOnAddPrinterOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add printer</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
        <div className="space-y-0.5">
            <Label>Printer Location</Label>
            <Select onValueChange={setSelectedPrinterLocation} value={selectedPrinterLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a printer location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Printer Location</SelectLabel>
                  <SelectItem value="kitchen">
                    Kitchen
                  </SelectItem>
                  <SelectItem value="billing">
                    Billing
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-0.5">
            <Label>Printer type</Label>
            <Select onValueChange={setSelectedPrinterType} value={selectedPrinterType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a printer to configure" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Printer Type</SelectLabel>
                  <SelectItem value="network">
                    Network printer
                  </SelectItem>
                  <SelectItem value="local" disabled={!printers.length}>
                    Local printer
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {
            selectedPrinterType === 'network' &&

            <div className="space-y-0.5">
              <Label htmlFor="printerip">
                Printer IP
              </Label>
              <Input
                id="printerip"
                placeholder="Enter printer ip address"
              />
            </div>
          }
          {
            selectedPrinterType === 'local' && <div className="space-y-0.5">
              <Label>Local printers</Label>
              <Select onValueChange={setSelectedPrinter} value={selectedPrinter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a printer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Printers</SelectLabel>
                    {
                      printers.map(printer => {
                        return <SelectItem id={printer.name} value={printer.name}>
                          {printer.name}
                        </SelectItem>
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          }
        </div>
        <DialogFooter>
          <Button onClick={addPrinter}>Add printer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
};

export default Printers;
