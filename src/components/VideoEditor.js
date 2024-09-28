export default function VideoEditor({
  primaryColour,
  setPrimaryColour,
  outlineColour,
  setOutlineColour,
  captionSize,
  setCaptionSize,
  preset,
  setPreset,
}) {
  return (
    <>
      <div className="bg-white text-black p-2 rounded-lg">
        <h3 className="font-semibold mb-3">Caption Options</h3>
        <div className="flex items-center mb-3">
          <span className="mr-2">Text color:</span>
          <input type="color" value={primaryColour} onChange={(e) => setPrimaryColour(e.target.value)} />
        </div>
        <div className="flex items-center mb-3">
          <span className="mr-2">Outline color:</span>
          <input type="color" value={outlineColour} onChange={(e) => setOutlineColour(e.target.value)} />
        </div>
        <div className="flex items-center mb-3">
          <span className="mr-2">Font size:</span>

          <div className="flex items-center mr-4 sm:mr-0">
            <input
              type="radio"
              id="small"
              name="font_size"
              value="30"
              checked={captionSize == 30}
              onChange={(e) => setCaptionSize(e.target.value)}
              className="mr-1"
            />
            <label htmlFor="small" className="mr-1">
              Small
            </label>
          </div>

          <div className="flex items-center mr-4  sm:mr-0">
            <input
              type="radio"
              id="medium"
              name="font_size"
              value="50"
              checked={captionSize == 50}
              onChange={(e) => setCaptionSize(e.target.value)}
              className="mr-1"
            />
            <label htmlFor="medium" className="mr-1">
              Medium
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="large"
              name="font_size"
              value="70"
              checked={captionSize == 70}
              onChange={(e) => setCaptionSize(e.target.value)}
              className="mr-1"
            />
            <label htmlFor="large">Large</label>
          </div>
        </div>
        <h3 className="font-semibold mb-3">Video Options</h3>
        <div className="flex items-center mb-3">
          <span className="mr-2">Quality:</span>

          <div className="flex items-center mr-4 sm:mr-0">
            <input
              type="radio"
              id="low"
              name="preset"
              value="ultrafast"
              checked={preset == "ultrafast"}
              onChange={(e) => setPreset(e.target.value)}
              className="mr-1"
            />
            <label htmlFor="low" className="mr-1">
              Low
            </label>
          </div>

          <div className="flex items-center mr-4  sm:mr-0">
            <input
              type="radio"
              id="default"
              name="preset"
              value="medium"
              checked={preset == "medium"}
              onChange={(e) => setPreset(e.target.value)}
              className="mr-1"
            />
            <label htmlFor="default" className="mr-1">
              Default
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="high"
              name="preset"
              value="veryslow"
              checked={preset == "veryslow"}
              onChange={(e) => setPreset(e.target.value)}
              className="mr-1"
            />
            <label htmlFor="high">High</label>
          </div>
        </div>
      </div>
    </>
  );
}
