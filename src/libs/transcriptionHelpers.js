function formatTime(timeStr) {
  const d = new Date(parseFloat(timeStr) * 1000);
  return d.toISOString().slice(11, 23).replace(".", ",");
}

export function formatToSrt(items) {
  let srt = "";
  let i = 1;
  items.forEach((item) => {
    srt += i + "\n";
    const { start, end } = item;
    srt += formatTime(start) + " --> " + formatTime(end) + "\n";

    srt += item.punctuated_word + "\n";
    srt += "\n";
    i++;
  });
  return srt;
}
