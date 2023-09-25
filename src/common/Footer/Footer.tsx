import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#264552",
    color: "white",
    position: "relative",
    bottom: "0",
    width: "100%",
  };
  return (
    <div>
      <footer
        className="text-center text-lg-start text-muted0"
        style={footerStyle}
      >
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>GoSaaS Inc</span>
          </div>

          <div>
            <a href="" className="me-4 text-reset">
              <FacebookIcon />
            </a>
            <a href="" className="me-4 text-reset">
              <TwitterIcon />
            </a>
            <a href="" className="me-4 text-reset">
              <GoogleIcon />
            </a>
            <a href="" className="me-4 text-reset">
              <InstagramIcon />
            </a>
            <a href="" className="me-4 text-reset">
              <LinkedInIcon />
            </a>
            <a href="" className="me-4 text-reset">
              <GitHubIcon />
            </a>
          </div>
        </section>
      </footer>
    </div>
  );
};

export default Footer;
