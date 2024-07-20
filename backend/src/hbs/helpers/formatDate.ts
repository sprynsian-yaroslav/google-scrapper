import { format as formatDateFNS } from "date-fns";
import Handlebars from "handlebars";

export function formatDate({hash: {formatDate = 'dd-MM-YYYY', date}}) {

  const formattedDate = formatDateFNS(date, formatDate);
  return new Handlebars.SafeString(formattedDate);
}