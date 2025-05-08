import logo from "../../../assets/images/logo.png";

export const Brand = () => {
  return (
          <div className="branding-section">
            <div className="mini-brand">
              <div className="logo">
                <img src={logo} alt="404 not found" />
              </div>
              <div className="welcome-text">
                  <p>Welcome to</p>
                  <h1>CACHE FLOW</h1>
                  <p>Streamlining support, one ticket at a time</p>
              </div>
            </div> 
          </div>
    
  )
}
