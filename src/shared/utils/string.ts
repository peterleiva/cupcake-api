export function dashcase(value: string): string {
  return value.toLowerCase().split(' ').join('-');
}
