import Reflux from "reflux";
import createStore from "reflux-core/lib/createStore";
import Immutable from "immutable";
import Actions from "../actions/actions.js";
import ObjectID from "bson-objectid";
import {
  merge,
  mapValues,
  forEach,
  omit,
  chunk,
  filter,
  reduce,
  trimStart,
  forIn
} from "lodash";
import DateTimeFormat from "date-and-time";
import axios from "axios";
import { serverURL } from "../appsettings.js";
import { AUTH_TOKEN, ACCESS_KEY, eventsLimit } from "../appsettings.js";
axios.defaults.headers.common["accesskey"] = ACCESS_KEY;
const AppStore = Reflux.createStore({
  listenables: [Actions],
  _allEvents: Immutable.Map({
    demo: Immutable.Map({
      id: "demo",
      name: "Office Birthday celebrations",
      bannerImageURL: "/svc/api/Attachments/download/r15MSc19M",
      eventLogoURL: "/svc/api/Attachments/download/B1Gmr9J9G",
      thumbnailURL: "/svc/api/Attachments/download/B1Umrqy5z",
      description:
        "1.Kathak dance performance by united dance group\n2.Comedy skit by Aryan group\n3.Pool party in the evening",
      timeZone: "IST",
      startDateTime: "2018-03-21T08:30:00.000Z",
      endDateTime: "2018-03-31T11:30:00.000Z",
      privacy: "Private",
      tags: ["Music"],
      cancellationPolicy:
        "From the payment amount of Rs 1000 , you will get only rs 700 after cancellation of already booked tickets",
      isOnlineEvent: true,
      currency: "INR",
      seatReservation: true,
      showRemainingTickets: true,
      address: {
        latlng: "",
        name: " Prince of Wales Dr Rd, Camp",
        addressLine1: " 15, Prince of Wales Dr Rd, Camp",
        addressLine2: "",
        city: " Pune",
        state: "Maharashtra",
        country: "India",
        postalCode: "411001"
      },
      registrationForm: [
        {
          label: "First Name",
          key: "FirstName",
          displayType: "text",
          options: [],
          optionsURL: "",
          isRequired: true
        },
        {
          label: "Last Name",
          key: "LastName",
          displayType: "text",
          options: [],
          optionsURL: "",
          isRequired: true
        },
        {
          label: "Email",
          key: "Email",
          displayType: "email",
          options: [],
          optionsURL: "",
          isRequired: true
        },
        {
          label: "Phone",
          key: "Phone",
          displayType: "text",
          options: [],
          optionsURL: "",
          isRequired: true
        },
        {
          label: "Street address",
          key: "_CurrentAddress.AddressLine",
          options: [],
          optionsURL: "",
          displayType: "text",
          isRequired: false
        },
        {
          label: "City",
          key: "_CurrentAddress.City",
          displayType: "text",
          options: [],
          optionsURL: "",
          isRequired: false
        },
        {
          label: "State",
          key: "_CurrentAddress.State",
          displayType: "text",
          options: [],
          optionsURL: "",
          isRequired: false
        },
        {
          label: "Country",
          key: "_CurrentAddress.Country",
          displayType: "country",
          options: [],
          optionsURL: "",
          isRequired: false
        },
        {
          label: "PostalCode",
          key: "_CurrentAddress.PostalCode",
          displayType: "text",
          options: [],
          optionsURL: "",
          isRequired: true
        }
      ],
      eventQuestion: [
        {
          label: "What you want before the Event",
          key: "5ab2030d590e31000a12a4d6",
          displayType: "text",
          options: [""],
          optionsURL: "",
          isRequired: false
        },
        {
          label: "How did you hear about this event?",
          key: "5ab203f22707bf00087b4530",
          displayType: "text",
          options: [""],
          optionsURL: "",
          isRequired: false
        },
        {
          label:
            "Please list any other comments or suggestions about the event",
          key: "5ab205782707bf00087b4533",
          displayType: "text",
          options: [""],
          optionsURL: "",
          isRequired: false
        },
        {
          label: "Do you prefer a morning, afternoon, or evening event?",
          key: "5ab2059e2707bf00087b4534",
          displayType: "text",
          options: [""],
          optionsURL: "",
          isRequired: false
        },
        {
          label:
            "Please list suggested speakers you would like to hear speak at the next event",
          key: "5ab2061e590e31000a12a4d8",
          displayType: "text",
          options: [""],
          optionsURL: "",
          isRequired: false
        },
        {
          label: "How far are you willing to travel to an event?",
          key: "5ab2062b590e31000a12a4d9",
          displayType: "text",
          options: [""],
          optionsURL: "",
          isRequired: false
        },
        {
          label:
            "How Would you like to receive additional information about the event ",
          key: "5ab206df2707bf00087b4535",
          displayType: "radio",
          options: ["Phone Call", "Test", "Email"],
          optionsURL: "",
          isRequired: false
        },
        {
          label:
            "How Would you like to receive additional information about the event ",
          key: "5ab206df2707bf00087b4536",
          displayType: "radio",
          options: ["Phone Call", "Test", "Email"],
          optionsURL: "",
          isRequired: false
        },
        {
          label: "How do you rate the content that was presented?",
          key: "5ab22d04590e31000a12a4ee",
          displayType: "dropdown",
          options: ["1", "2", "3", "4", "5"],
          optionsURL: "",
          isRequired: false
        }
      ],
      speakers: {
        "5ab10bc71c59cf0008352595": {
          id: "5ab10bc71c59cf0008352595",
          firstName: "Alice",
          lastName: "Smith",
          imageURL: "/svc/api/Attachments/download/undefined",
          title: "Freestyle dancer",
          about:
            "Freestyle is a way of dancing in which the dancer improvises his moves on the spot, as he dances, instead of having them planned beforehand (ie choreography). ... ",
          email: "Alice@ee.com",
          phone: "8529631731",
          socialMedia: {
            linkdin: "Alice@likedin.com",
            twitter: "Alice@likedin.com",
            facebook: "alice@gmail.com"
          }
        },
        "5ab20bd32707bf00087b4537": {
          id: "5ab20bd32707bf00087b4537",
          firstName: "Abott",
          lastName: "Loy",
          imageURL: "/svc/api/Attachments/download/undefined",
          title: "Opera singer",
          about:
            "Opera is an art form in which singers and musicians perform a dramatic work combining text (libretto) and musical score, usually in a theatrical setting. In traditional opera, singers do two types of singing: recitative, a speech-inflected style and arias, a more melodic style",
          email: "Abott@ee.com",
          phone: "8524569513",
          socialMedia: {
            linkdin: "Abott@likedin.com",
            twitter: "Abott@likedin.com",
            facebook: "Abott@ee.com"
          }
        }
      },
      registrationType: {
        "5aaf72254124870008acefe3": {
          id: "5aaf72254124870008acefe3",
          label: "Student",
          allowMultiple: false
        },
        "5aaf72964738fa0007b2cdb6": {
          id: "5aaf72964738fa0007b2cdb6",
          label: "Sponsor",
          allowMultiple: false
        }
      },
      sessions: {
        "5ab20259590e31000a12a4d5": {
          id: "5ab20259590e31000a12a4d5",
          startDateTime: "2018-03-19T18:30:00.000Z",
          endDateTime: "2018-03-30T18:30:00.000Z",
          label: "Session 1",
          speakers: ["5ab10bc71c59cf0008352595"],
          location: "Pune",
          tickets: [
            "5aaf754c4124870008acefe8",
            "5ab1fbb72707bf00087b452c",
            "5ab1fbb7590e31000a12a4d3"
          ],
          type: ""
        },
        "5ab2025a2707bf00087b452e": {
          id: "5ab2025a2707bf00087b452e",
          startDateTime: "2018-03-19T18:30:00.000Z",
          endDateTime: "2018-03-30T18:30:00.000Z",
          label: "Session 2",
          speakers: ["5ab10bc71c59cf0008352595"],
          location: "Pune",
          tickets: ["5ab1fbb72707bf00087b452c"],
          type: ""
        },
        "5ab2025b2707bf00087b452f": {
          id: "5ab2025b2707bf00087b452f",
          startDateTime: "2018-03-19T18:30:00.000Z",
          endDateTime: "2018-03-30T18:30:00.000Z",
          label: "Session 3",
          speakers: ["5ab10bc71c59cf0008352595"],
          location: "Pune",
          tickets: ["5ab20dcd590e31000a12a4da"],
          type: ""
        }
      },
      tickets: [
        {
          id: "5ab1fbb72707bf00087b452c",
          group: "Ticket ",
          label: "Ticket",
          description: "",
          type: "",
          price: 200,
          startDateTime: "2018-03-20T05:30:00.000Z",
          endDateTime: "2018-05-19T18:30:00.000Z",
          validateQty: true,
          availableQty: 50,
          registrationType: [
            "5aaf72254124870008acefe3",
            "5aaf72964738fa0007b2cdb6"
          ]
        },
        {
          id: "5ab1fbb7590e31000a12a4d3",
          group: "Ticket ",
          label: "Premium Ticket",
          description: "Premium ticket",
          type: "",
          price: 560,
          startDateTime: "2018-03-20T05:30:00.000Z",
          endDateTime: "2018-05-19T18:30:00.000Z",
          validateQty: true,
          availableQty: 100,
          registrationType: []
        },
        {
          id: "5ab20dcd590e31000a12a4da",
          group: "Donation ",
          label: "Donation Ticket",
          description: "Donation ticket",
          type: "",
          price: 600,
          startDateTime: "2018-03-20T18:30:00.000Z",
          endDateTime: "2018-03-30T18:30:00.000Z",
          validateQty: true,
          availableQty: 50,
          registrationType: ["5aaf72964738fa0007b2cdb6"]
        }
      ],
      organizerContactDetails: {
        name: "Paragyte",
        about: "string",
        address: {
          addressLine: "201, WTC Tower A,Kharadi",
          city: "Pune",
          state: "Maharashtra",
          country: "India",
          postalCode: "411014"
        },
        email: "",
        mobileNo: "0204578965",
        socialMedia: { linkdin: "", twitter: "", facebook: "" }
      }
    })
  }),
  _skip: 0,
  _limit: eventsLimit,
  _key: "",
  _totalPages: Immutable.Map(),
  init: function() {
    this.state = Immutable.Map({
      events: Immutable.Map(),
      processClear: false,
      cardClear: false,
      currentEvent: null,
      pendigStatus: false,
      orderedEvent: null,
      responses: Immutable.Map({
        registrationResponse: Immutable.Map(),
        eventSurveyResponse: Immutable.Map(),
        ticketDetails: Immutable.Map({
          registrationType: "",
          selectedTickets: Immutable.Set(),
          qty: "1",
          totalAmount: "0",
          selectedSessions: Immutable.Set(),
          ticketGroup: ""
        }),
        cardDetails: Immutable.Map({
          number: "",
          name: "",
          expiry: "",
          cvc: ""
        })
      }),
      activeStep: 0,
      totalPage: 0,
      currentPage: 0
    });
  },
  updateState: function(newState, suppressTrigger) {
    if (this.state.equals(newState)) {
      //return;
    }
    if (newState) {
      this.state = newState;
    }

    if (!suppressTrigger) {
      this.trigger(this.state);
    }
  },
  next: function() {
    let pageNo = this.state.get("currentPage"),
      totalPage = this.state.get("totalPage");
    if (!totalPage) {
      return;
    }
    this.updateState(
      this.state.set("currentPage", Math.min(pageNo + 1, totalPage - 1)),
      true
    );
    this.getEvents();
  },
  prev: function() {
    let pageNo = this.state.get("currentPage");
    this.updateState(
      this.state.set("currentPage", Math.max(pageNo - 1, 0)),
      true
    );
    this.getEvents();
  },
  jumpTo: function(pageNo) {
    this.updateState(this.state.set("currentPage", pageNo), true);
    this.getEvents();
  },
  search: function(key) {
    if (this._key == key) {
      return;
    }
    this._key = key;
    this.getAfterTotal();
  },
  getAfterTotal: function() {
    return axios({
      url: `${serverURL}/svc/api/Events`,
      method: "GET",
      params: {
        filter: {
          where: {
            EndDate: { gt: new Date() }
          },
          fields: ["id"]
        }
      }
    }).then(response => {
      let { data } = response;
      this.updateState(
        this.state.set("totalPage", Math.ceil(data.length / this._limit))
      );
      return this.getEvents();
    });
  },
  getEvents: function() {
    let pageNo = this.state.get("currentPage");
    this._skip = this._limit * pageNo;
    return axios({
      url: `${serverURL}/svc/api/Events`,
      method: "GET",
      params: {
        filter: {
          where: {
            EndDate: { gt: new Date() }
          },
          limit: this._limit,
          skip: this._skip
        }
      }
    }).then(response => {
      let { data } = response,
        events = Immutable.Map();
      data.forEach(event => {
        events = events.set(event.id, Immutable.Map(event));
      });
      this.updateState(
        this.state.set("events", this.state.get("events").merge(events))
      );
    });
  },
  loadEvents: function() {
    return this.getAfterTotal();
  },
  loadEvent: function(id) {
    if (!id) {
      return;
    }
    if (
      this.state.getIn(["currentEvent"]) &&
      this.state.getIn(["currentEvent", "id"]) == id
    ) {
      this.triggerState();
      return;
    }
    if (this._allEvents.has(id)) {
      this.updateState(this.state.set("currentEvent", this._allEvents.get(id)));
      return;
    }
    return axios({
      url: `${serverURL}/svc/api/Events/condensed?eventid=${id}`,
      method: "GET"
    })
      .then(response => {
        let { data } = response;
        this._allEvents = this._allEvents.set(id, Immutable.Map(data.result));
        this.updateState(
          this.state.set("currentEvent", Immutable.Map(data.result))
        );
      })
      .catch(err => {
        console.debug(err);
      });
  },
  setTicketInfo: function(value) {
    this.updateState(this.state.setIn(["responses", "ticketDetails"], value));
    let processClear = this.validateProcess();
    this.updateState(this.state.set("processClear", processClear));
  },

  setCardtInfo: function(value) {
    this.updateState(this.state.setIn(["responses", "cardDetails"], value));
  },
  setResponse: function(type, key, value) {
    this.updateState(this.state.setIn(["responses", type, key], value));
    let processClear = this.validateProcess();
    this.updateState(this.state.set("processClear", processClear));
  },
  triggerState: function() {
    this.trigger(this.state);
  },
  validTicketInfo: function() {
    let tickets = this.state.getIn(["currentEvent", "tickets"]);
    if (!tickets.length) {
      return true;
    }
    let selectedTickets = this.state.getIn([
      "responses",
      "ticketDetails",
      "selectedTickets"
    ]);
    return !!selectedTickets.size;
  },
  validUserInfo: function() {
    let registrationForm = this.state.getIn([
        "currentEvent",
        "registrationForm"
      ]),
      registrationResponse = this.state.getIn([
        "responses",
        "registrationResponse"
      ]);
    if (!registrationForm.length) {
      return true;
    }
    return reduce(registrationForm, (result, form) => {
      if (form.isRequired && !registrationResponse.get(form.key)) {
        result = false;
        return result;
      }
      return result;
    });
  },
  validSurvey: function() {
    let eventQuestion = this.state.getIn(["currentEvent", "eventQuestion"]),
      eventSurveyResponse = this.state.getIn([
        "responses",
        "eventSurveyResponse"
      ]);
    if (!eventQuestion.length) {
      return true;
    }
    return reduce(eventQuestion, (result, form) => {
      if (form.isRequired && !eventSurveyResponse.get(form.key)) {
        result = false;
        return result;
      }
      return result;
    });
  },
  validateStep: function(number) {
    let activeStep = this.state.get("activeStep"),
      valid = true;
    if (number > activeStep) {
      if (activeStep == 0) {
        valid = this.validTicketInfo();
      }
      if (activeStep == 1) {
        valid = this.validUserInfo();
      }
      if (activeStep == 2) {
        valid = this.validSurvey();
      }
    }
    if (!valid) {
      return;
    }
    this.updateState(this.state.set("activeStep", number));
  },
  validateProcess: function() {
    if (this.validTicketInfo() && this.validUserInfo() && this.validSurvey()) {
      return true;
    }
    return false;
  },
  processPayment: function(id, history) {
    if (this.validateProcess()) {
      history.push({ pathname: `/events/${id}/register/payment` });
    }
  },
  checkStatus: function(id, history) {
    return axios({
      url: `${serverURL}/svc/api/Registrations/${id}`,
      method: "GET"
    })
      .then(response => {
        let { data } = response;
        if (data.Status == "Pending") {
          console.debug(data);
          setTimeout(this.checkStatus.bind(this, id, history), 2000);
        } else {
          console.debug(data);
          this.updateState(this.state.set("orderedEvent", Immutable.Map(data)));
          let eventID = this.state.getIn(["currentEvent", "id"]);
          history.replace({
            pathname: `/events/${eventID}/register/status/${id}`
          });
        }
      })
      .catch(err => {
        console.debug(err);
        this.updateState(this.state.set("pendigStatus", false));
      });
  },
  finish: function(history) {
    if (!this.validateProcess()) {
      return;
    }
    let event = this.state.get("currentEvent").toJS(),
      responses = this.state.get("responses").toJS(),
      {
        registrationResponse,
        eventSurveyResponse,
        ticketDetails,
        cardDetails
      } = responses,
      {
        selectedTickets,
        qty,
        totalAmount,
        selectedSessions,
        registrationType
      } = ticketDetails,
      { number, name, expiry, cvc } = cardDetails,
      {
        id,
        name: eName,
        timeZone,
        startDateTime,
        endDateTime,
        currency
      } = event,
      expiryDate = chunk(expiry, 2),
      surveyResponse = [];
    forIn(eventSurveyResponse, (value, key) => {
      surveyResponse.push({ key, value });
    });
    let data = {
      eventDetails: {
        id,
        name: eName,
        timeZone,
        startDateTime,
        endDateTime,
        currency
      },
      registrationType,
      ticketDetails: { selectedTickets, qty, totalAmount },
      registrationResponse,
      selectedSessions,
      eventSurveyResponse: surveyResponse,
      cardDetails: {
        number,
        name,
        expiryMonth: expiryDate[0].join(""),
        expiryYear: expiryDate[1].join(""),
        cvv: cvc
      }
    };
    console.debug(data);
    this.updateState(this.state.set("pendigStatus", true));
    return axios({
      url: `${serverURL}/svc/api/Registrations/eventRegister`,
      method: "POST",
      data: { ...data }
    })
      .then(response => {
        let { data: { result: orderID } } = response;
        //console.debug(orderID);
        this.checkStatus(orderID, history);
      })
      .catch(err => {
        this.updateState(this.state.set("pendigStatus", false));
        console.debug(err);
      });
  },
  resetResponse: function() {
    this.updateState(
      this.state.set(
        "responses",
        Immutable.Map({
          registrationResponse: Immutable.Map(),
          eventSurveyResponse: Immutable.Map(),
          ticketDetails: Immutable.Map({
            registrationType: "",
            selectedTickets: Immutable.Set(),
            qty: "1",
            totalAmount: "0",
            selectedSessions: Immutable.Set(),
            ticketGroup: ""
          }),
          cardDetails: Immutable.Map({
            number: "",
            name: "",
            expiry: "",
            cvc: ""
          })
        })
      )
    );
  },
  reset: function() {
    this._skip = 0;
    this.updateState(
      this.state
        .set("currentPage", 0)
        .set("totalPage", 0)
        .set("events", Immutable.Map())
        .set(
          "responses",
          Immutable.Map({
            registrationResponse: Immutable.Map(),
            eventSurveyResponse: Immutable.Map(),
            ticketDetails: Immutable.Map({
              registrationType: "",
              selectedTickets: Immutable.Set(),
              qty: "1",
              totalAmount: "0",
              selectedSessions: Immutable.Set(),
              ticketGroup: ""
            }),
            cardDetails: Immutable.Map({
              number: "",
              name: "",
              expiry: "",
              cvc: ""
            })
          })
        )
    );
  }
});

export default AppStore;
