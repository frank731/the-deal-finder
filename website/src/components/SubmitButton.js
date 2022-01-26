import './Login.css'
import  './Wishlist.css'

function SubmitButton(props) {
    const { text, func } = props;
  
    return (
      <button onClick={func} type="submit" className="btn btn-dark text-1 login-button submit-button valign-text-middle roboto-normal-white-18px clearfix">
            {text}
      </button>
    );
  }

  export default SubmitButton;