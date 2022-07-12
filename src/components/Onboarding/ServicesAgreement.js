import React, { Component } from "react";

export class ServicesAgreement extends Component {
  constructor(props) {
    super(props);
  }

  onSwitchAgreement = (isagreed) => {
    this.props.onSwitchAgreement(isagreed);
  };

  render() {
    return (
      <div className="float wizard-container">
        <h3 className="mt-56">
          Thank you for purchesed Q8 Vista! Before starting, please agree the
          terms of service below:
        </h3>
        <div className="rectangle-mask mt-16">
          <div className="mt-24 title-1">TERMS OF SERVICE</div>
          <div className="border-bottom-2 mt-6 mb-11"></div>
          <div className="container">
            <p className="bold">
              PLEASE READ THIS MASTER SERVICES AGREEMENT (THIS “AGREEMENT”)
              CAREFULLY BEFORE PURCHASING OR USING THE ARISTA NETWORKS SERVICES.
            </p>
            <p className="bold">
              BY PURCHASING OR USING THE ARISTA NETWORKS SERVICES, YOU ARE
              CONSENTING TO BE BOUND BY THIS AGREEMENT.
            </p>
            <p className="regular">
              The following terms govern your use of the Arista Networks
              Services.
            </p>
            <p className="regular">
              This Agreement consists of this signature page and the following
              attachments, which are incorporated in this Agreement by this
              reference:
            </p>
            <p className="regular">
              1. Master Services Agreement General Terms and Conditions
            </p>
            <p className="regular">
              2. EXHIBIT A: Global Services A-Care Exhibit, including Appendix A
            </p>
            <p className="regular">
              3. EXHIBIT B: Professional Services Exhibit
            </p>
            <p className="regular">
              4. EXHIBIT C: Cloud Services Subscription Agreement Exhibit
            </p>
            <p className="bold center pt-24 pb-16">
              MASTER SERVICES AGREEMENT GENERAL TERMS AND CONDITIONS
            </p>
            <p className="regular">1. DEFINITIONS.</p>
            <p className="regular">
              1.1. “Arista Portal” means Arista support website, Arista’s portal
              for online services and information.
            </p>
            <p className="regular">
              1.2. “Customer” means the entity subscribing for Services pursuant
              to a Purchase Order or an agreement between Arista and Customer
              who is the final end user, purchaser or licensee and has acquired
              Product(s) for its own internal use and not for resale,
              remarketing, or redistribution.
            </p>
            <p className="regular">
              1.3. “Customer Programmable Product” means products from Arista,
              including but not limited to the FX line of products, in which the
              software portions are programmable by parties other than Arista.
            </p>
            <p className="regular">
              1.4. “Deliverable” means, with respect to each Statement of Work,
              the items specified as deliverables in the Statement of Work.
            </p>
            <p className="regular">
              1.5. “Hardware” means tangible Arista equipment and/or components
              made available to Customer.
            </p>
            <p className="regular">
              1.6. “Maintenance Release” means an incremental release of Arista
              Software that provides maintenance fixes and may provide
              additional Software features. Maintenance Releases are designated
              by Arista as a change in the digit(s) to the right of the tenths
              digit of the Software version number [x.x.(x)].
            </p>
            <p className="regular">
              1.7. “Maintenance Services” means Arista’s A-Care Services
              Customer may elect to purchase described at
              https://www.arista.com/assets/data/pdf/A-CareServicesOverview.pdf
              and provided subject to the terms of Exhibit A attached hereto.
            </p>
            <p className="regular">
              1.8. “Major Release” means a release of Arista Software that
              provides additional Software features and/or functions. Major
              Releases are designated by Arista as a change in the ones digit of
              the Software version number [(x).x.x].
            </p>
          </div>
        </div>
        <div className="nav-footer mt-24">
          <button
            className="primary-btn"
            onClick={() => this.onSwitchAgreement(false)}
          >
            DISAGREE
          </button>
          <button
            className="primary-btn ml-24"
            onClick={() => this.onSwitchAgreement(true)}
          >
            AGREE
          </button>
        </div>
      </div>
    );
  }
}
