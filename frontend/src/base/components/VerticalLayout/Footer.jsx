import React from "react"
import { DateTime } from "luxon";

const Footer = () => {
  return (
      <footer className="footer">
        {DateTime.now().year} © Google scraper.
      </footer>
  )
}

export default Footer
