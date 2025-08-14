import { parse, format } from 'date-fns';


//Process Raw JSON Response
export type RawItem = {
  itemname: string;
  unitprice: number;
  totalprice: number;
};

export type ReceiptJSON = {
  location: string;
  date: string;
  items: RawItem[];
};

export type Item = {
  itemname: string;
  unitprice: number;
  totalprice: number;
  location: string;
  date: string; // ISO format
  quantity: number;
};


export const normalizeDate = (input: string): string => {
  const cleaned = input.toUpperCase().replace(/,/g, '').replace(/\s+/g, '').trim();
  const formats = [
    'MMMddyyyyh:mma',
    'MMMddyyyyh:mma',
    'MMMdyyyyh:mma',
    'MMMdyyyyh:mma',
    'MMMddyyyyHH:mm',
    'MMMddyyyyHH:mm',
    'MMMdyyyyHH:mm',
    'MMMdyyyyHH:mm',
  ];

  for (const fmt of formats) {
    const parsed = parse(cleaned, fmt, new Date());

    if (!isNaN(parsed.getTime())) {
      return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
    }
  }
  return 'Invalid date: ' + input;
};

export const processJSON = (receipt: ReceiptJSON): Item[] => {
  console.log("Started processing---")
  const processedItems: Item[] = receipt.items.map((item) => ({
    date: normalizeDate(receipt.date).toString(),
    itemname: item.itemname,
    unitprice: item.unitprice,
    totalprice: item.totalprice,
    location: receipt.location,
    quantity: parseFloat((item.totalprice/item.unitprice).toFixed(2)),
    
  }));
  console.log("SUCCESS: processing complete")
  return processedItems;
}

export const parseNumber  = (input: string): number =>{
  const trimmed = input.trim();

  if (trimmed === '') return Infinity;

  // Remove commas used as thousand separators
  const normalized = trimmed.replace(/,/g, '');

  const parsed = Number(normalized);

  return isNaN(parsed) ? NaN : parsed;
}
