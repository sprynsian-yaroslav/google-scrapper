import Handlebars from "handlebars"

interface buttonArgs {
  color?: string
  text?: string
  type?: string
}
export function button (color, text, type: buttonArgs, onClick) {
  const buttonClasses = {
    default: "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
    green: "bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
    red: "bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
    yellow: "bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700",
    gray: "bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700",
  };

  const colorClass = buttonClasses[color] || buttonClasses.default;
  const buttonText = Handlebars.escapeExpression(text);

  return new Handlebars.SafeString(
      "<button onClick='" + onClick +"' type='" + type + "' class='text-white focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center" + colorClass + "'>" + buttonText + "</button>"
  );
};