// import { Button } from '@/components/custom/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecentSales } from './components/recent-sales';
import { Overview } from './components/overview';
import { ISalesSeriesData } from '@/models/dashboard';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as apis from '@/apis';
import { formatPrice } from '@/utils/currency';
import { IconCurrencyRupee } from '@tabler/icons-react';
import moment from 'moment';

export default function Dashboard() {
  const { shopId } = useParams<{ shopId: string }>();
  const [salesByDate, setSalesByDate] = useState<ISalesSeriesData[]>([]);

  const getSales = async (shopId: string) => {
    try {
      const response = await apis.getSalesData(shopId);
      setSalesByDate(
        Object.keys(response.data.salesByDate).map((key) => ({
          ...response.data.salesByDate[key],
          name: key,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (shopId) getSales(shopId);
  }, [shopId]);

  const total = salesByDate.reduce((acc, curr) => acc + curr.total, 0);
  const cash = salesByDate.reduce((acc, curr) => acc + curr.cash, 0);
  const upi = salesByDate.reduce((acc, curr) => acc + curr.upi, 0);

  const lastDaySale = salesByDate.find((sale) => {
    const lastDay = moment(new Date()).subtract(1, 'd').format('DD/MM/YYYY');
    if (lastDay === sale.name) {
      return true;
    }
    return false;
  });

  console.log(lastDaySale);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>
        {/* <div className="flex items-center space-x-2">
          <Button>Download</Button>
        </div> */}
      </div>
      <Tabs
        orientation="vertical"
        defaultValue="overview"
        className="space-y-4"
      >
        <div className="w-full pb-2">
          <TabsList>
            <TabsTrigger value="overview">Current Week</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
                <IconCurrencyRupee className="text-gray-400" size={'18px'} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(total || 0)}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sale in Cash
                </CardTitle>
                <IconCurrencyRupee className="text-gray-400" size={'18px'} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(cash)}</div>
                {/* <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sale in UPI
                </CardTitle>
                <IconCurrencyRupee className="text-gray-400" size={'18px'} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(upi)}</div>
                {/* <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Last Day's Sale
                </CardTitle>
                <IconCurrencyRupee className="text-gray-400" size={'18px'} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(lastDaySale?.total || 0)}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p> */}
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={salesByDate} />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Showing last 5 sales</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

// const topNav = [
//   {
//     title: "Overview",
//     href: "dashboard/overview",
//     isActive: true,
//   },
//   {
//     title: "Customers",
//     href: "dashboard/customers",
//     isActive: false,
//   },
//   {
//     title: "Products",
//     href: "dashboard/products",
//     isActive: false,
//   },
//   {
//     title: "Settings",
//     href: "dashboard/settings",
//     isActive: false,
//   },
// ];
