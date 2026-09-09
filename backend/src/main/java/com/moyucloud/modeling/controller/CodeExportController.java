package com.moyucloud.modeling.controller;

import com.moyucloud.auth.service.*;
import com.moyucloud.modeling.repository.DataTableRepository;
import com.moyucloud.modeling.service.CrudCodeGeneratorService;
import jakarta.servlet.http.HttpServletResponse;
import java.util.zip.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/modeling/tables")
public class CodeExportController {
    private final DataTableRepository repo;
    private final CrudCodeGeneratorService gen;
    private final AuthService auth;

    public CodeExportController(DataTableRepository r, CrudCodeGeneratorService g, AuthService a) {
        repo = r;
        gen = g;
        auth = a;
    }

    @GetMapping("/{id}/export.zip")
    public void export(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String id,
            HttpServletResponse response)
            throws Exception {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var m = gen.generate(repo.findById(id).orElseThrow());
        response.setContentType("application/zip");
        response.setHeader(
                "Content-Disposition", "attachment; filename=\"" + m.tableCode() + "-crud.zip\"");
        try (var z = new ZipOutputStream(response.getOutputStream())) {
            for (var f : m.files()) {
                z.putNextEntry(new ZipEntry(f.path()));
                z.write(f.content().getBytes(java.nio.charset.StandardCharsets.UTF_8));
                z.closeEntry();
            }
        }
    }
}
