type MockCodeMirrorProps = {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export default function MockCodeMirror({ value, onChange, onBlur }: MockCodeMirrorProps) {
  return (
    <textarea
      data-testid="mock-codemirror"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
    />
  )
}
