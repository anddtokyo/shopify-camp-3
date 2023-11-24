import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import {
  LegacyCard,
  DataTable,
  DatePicker,
  Frame,
  Button,
  Text,
} from "@shopify/polaris";
import { format, subMonths } from "date-fns";

export function OrdersTable() {
  const authenticatedFetch = useAuthenticatedFetch();
  const currentDate = useMemo(() => new Date());
  const [loading, setLoading] = useState(true);

  const [{ month, year }, setDate] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: subMonths(currentDate, 1),
    end: currentDate,
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );
  const [tableRows, setTableRows] = useState([]);

  const parseTableData = (products) => {
    return products.map((product) => {
      const tableProduct = [];
      for (const productField of Object.keys(product)) {
        let productAtt = product[productField];
        if (productField === "createdAt") {
          productAtt = format(new Date(productAtt), "yyyy/MM/dd hh:mm");
        }
        tableProduct.push(productAtt);
      }
      return tableProduct;
    });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const getProductsResponse = await authenticatedFetch("/api/pixels", {
        method: "post",
      });

      // setTableRows(parseTableData(getProductsResponse.products));
    } catch (e) {
      console.error(e);
    }
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Frame>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Text variant="headingMd" as="h3">
          Select product creation date range
        </Text>
        <DatePicker
          month={month}
          year={year}
          onChange={setSelectedDates}
          onMonthChange={handleMonthChange}
          selected={selectedDates}
          allowRange
          disableDatesAfter={currentDate}
        />
        <div>
          <Button onClick={fetchProducts} loading={loading}>
            Fetch products
          </Button>
        </div>
        <LegacyCard>
          <DataTable
            columnContentTypes={["text", "text", "text", "text"]}
            headings={["Product", "Status", "Description", "Created At"]}
            rows={tableRows}
          />
        </LegacyCard>
      </div>
    </Frame>
  );
}
