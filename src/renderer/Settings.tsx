
import './Settings.css';

const Settings = (props) => {

  return (
    <div>
      <div className="path-selector">
        <div
          className="btn btn-path-selector"
          onClick={() => props.selectBuilderPath()}
        >
          Select OSP Builder Path:
        </div>
        <div className="btn-path">{props.builderPath}</div>
      </div>
    </div>
  );
};

export default Settings;
