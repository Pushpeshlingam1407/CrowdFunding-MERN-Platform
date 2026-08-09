import React from "react";


const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <Container>
        <Grid cols="1.5fr 1fr 1fr 1fr">
          <div>
            <Link to="/" className="footer-logo">
              Startup<span>Fund</span>
            </Link>
            <p className="footer-description">
              The definitive crowdfunding infrastructure for the global startup
              ecosystem.
            </p>
            <Flex gap="1.5rem">
              <Link to="/admin/login" className="footer-link footer-small-link">
                Executive Terminal
              </Link>
            </Flex>
          </div>
          <div>
            <h4 className="footer-sub-heading">Ecosystem</h4>
            <Flex direction="column" align="flex-start" gap="1rem">
              <Link to="/campaigns" className="footer-link">Marketplace</Link>
              <Link to="/dashboard" className="footer-link">Dashboard</Link>
            </Flex>
          </div>
          <div>
            <h4 className="footer-sub-heading">Compliance</h4>
            <Flex direction="column" align="flex-start" gap="1rem">
              <span className="footer-compliance-item">Secure Ledger</span>
              <span className="footer-compliance-item">Professional Terms</span>
              <span className="footer-compliance-item">Verification Audit</span>
            </Flex>
          </div>
          <div>
            <h4 className="footer-sub-heading">Connect</h4>
            <Flex direction="column" align="flex-start" gap="1rem">
              <Link to="#" className="footer-link">Enterprise Support</Link>
              <Link to="#" className="footer-link">Documentation</Link>
              <Link to="#" className="footer-link">API Terminal</Link>
              <Link to="#" className="footer-link">Security Disclosures</Link>
            </Flex>
          </div>
        </Grid>
        <Copyright>
          <span>
            &copy; {new Date().getFullYear()} StartupFund Executive Terminal.
            ISO 27001 Compliant.
          </span>
          <Flex gap="2rem">
            <span className="footer-copyright-item">Cookie Policy</span>
            <span className="footer-copyright-item">Data Ethics</span>
          </Flex>
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
