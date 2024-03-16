import {
  Avatar,
  Group,
  SelectProps,
  Text,
  useMantineColorScheme,
} from "@mantine/core";

export const SelectItem: SelectProps["renderOption"] = ({ option }) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Group wrap="nowrap">
      <Avatar src={`${option.value}-${colorScheme}-mode.svg`} />
      <div>
        <Text size="sm">{option.label}</Text>
      </div>
    </Group>
  );
};
