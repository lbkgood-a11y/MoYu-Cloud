package com.moyucloud.system.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
public record UpdateMenuRequest(@NotNull Long parentId,@NotBlank String menuName,String permission,@NotBlank String menuType){}
