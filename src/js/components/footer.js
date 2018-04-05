import React, { Component } from "react";
import PropTypes from "prop-types";
import Divider from "material-ui/Divider";
const useEvent = [
    "How It Works",
    "For Large & Complex Events",
    "Pricing",
    "Content Standards",
    "Event Registration Mobile App",
    "Event Registration Check-In App",
    "Event Registration Spectrum",
    "Rally - Fun Things To Do",
    "Free Event Management Courses",
    "Sitemap"
  ],
  planEvent = [
    "Conference Management Software",
    "Food and Drink Ticketing",
    "Nonprofits & Fundraisers",
    "Sell Tickets",
    "Event Management & Planning",
    "Online Event Registration",
    "Online RSVP",
    "Music Venues & Promoters",
    "Event Equipment & Staffing",
    "Event Promotion"
  ],
  findEvents = [
    "Boston Events",
    "Chicago Events",
    "Denver Events",
    "Houston Events",
    "Los Angeles Events",
    "Nashville Events",
    "New York Events",
    "San Diego Events",
    "San Francisco Events",
    "All Cities"
  ],
  contryList = [
    "Argentina",
    "Australia",
    "België",
    "Belgique",
    "Brasil",
    "Canada(EN)",
    "Canada(FR)",
    "Chile",
    "Colombia",
    "Deutschland",
    "España",
    "France",
    "Hong Kong",
    "Ireland",
    "Italia",
    "Mexico",
    "Nederland",
    "New Zealand",
    "Österreich",
    "Peru",
    "Portugal",
    "Singapore",
    "United Kingdom",
    "United States"
  ],
  footerMenu = [
    "About",
    "Blog Help",
    "Careers",
    "Press",
    "Security",
    "Developers",
    "Terms",
    "Privacy",
    "Cookies"
  ],
  mediaDetails = [
    { icon: "", label: "Contact Support" },
    { icon: "", label: "Contact Sales" },
    { icon: "", label: "Facebook" },
    { icon: "", label: "Twitter" },
    { icon: "", label: "LinkedIn" },
    { icon: "", label: "Instagram" },
    { icon: "", label: "Google+" }
  ];
class Footer extends Component {
  render() {
    return (
      <div className="row center-xs ">
        <div className="col-xs-9 footerlinksParent">
          <div className="center-xs companayName">
            {"© 2018 Event Registration"}
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
