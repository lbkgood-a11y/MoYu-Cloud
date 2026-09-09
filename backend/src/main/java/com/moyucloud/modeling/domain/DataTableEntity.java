package com.moyucloud.modeling.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "meta_table")
public class DataTableEntity {
    @Id
    @Column(length = 26, columnDefinition = "char(26)")
    private String id;

    @Column(nullable = false, unique = true, length = 80)
    private String tableCode;

    @Column(nullable = false, length = 120)
    private String tableName;

    @Column(nullable = false)
    private boolean enabled = true;

    @OneToMany(mappedBy = "table", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DataFieldEntity> fields = new ArrayList<>();

    protected DataTableEntity() {}

    public DataTableEntity(String code, String name) {
        tableCode = code;
        tableName = name;
    }

    @PrePersist
    void assign() {
        if (id == null) id = Ulid.next();
    }

    public String getId() {
        return id;
    }

    public String getTableCode() {
        return tableCode;
    }

    public String getTableName() {
        return tableName;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public List<DataFieldEntity> getFields() {
        return fields;
    }

    public void addField(DataFieldEntity f) {
        fields.add(f);
        f.setTable(this);
    }
}
