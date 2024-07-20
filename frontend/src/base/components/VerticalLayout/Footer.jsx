import React from "react"
import { DateTime } from "luxon";

const Footer = () => {
  return (
      <footer className="footer">
        {DateTime.now().year} © OptimallyMe.
      </footer>
  )
}

export default Footer
