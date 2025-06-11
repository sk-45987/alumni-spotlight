import { Radio } from 'antd';

export default function ContentSlider({ value, onChange }) {
  return (
    <div className="flex justify-center py-4">
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        size="middle"
      >
        <Radio.Button value="original">Original</Radio.Button>
        <Radio.Button value="simplified">Simplified</Radio.Button>
        <Radio.Button value="minimal">Minimal</Radio.Button>
      </Radio.Group>
    </div>
  );
}